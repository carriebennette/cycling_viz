(function () {
    
    const margin_x = 30;
    const margin_y = 0;
    const width = 50;
    const height = 50;
    const svgBackground = "#fff";
    const nodeWidth = 1.3;
    const nodePadding = 0.5;
    const nodeOpacity = 0.75;
    const linkOpacity = 0.75;
    const nodeDarkenFactor = 3;
    const nodeStrokeWidth = 0;
    const linkOpacityHover = 0.75;
    const arrow = "\u2192";
    const nodeAlignment = d3.sankeyJustify;
    const path = d3.sankeyLinkHorizontal();

    /* team colors */
    let colorScale = d3.scaleOrdinal()
      .domain(["ag2r-citroen-team", "astana-premier-tech", "bahrain-victorious", "bora-hansgrohe", "cofidis-solutions-credits","deceuninck-quick-step","ef-education-nippo",
               "teambikeexchange","groupama-fdj","intermarche-wanty-gobert", "israel-start-up-nation-20","lotto-soudal","movistar-team","team-dsm",
               "ineos-grenadiers","team-jumbo-visma","team-qhubeka-assos","trek-segafredo","uae-team-emirates","non-WT-team-20","neo-pro",
               "ag2r-la-mondiale", "astana-pro-team", "bahrain-mclaren", "bora-hansgrohe-20", "ccc-team", "cofidis-solutions-credits-20", "deceuninck-quick-step-20", 
               "ef-pro-cycling", "groupama-fdj-20", "mitchelton-scott", "ntt-pro-cycling", "israel-start-up-nation-20", "lotto-soudal-20", "movistar-team-20", 
               "team-sunweb", "ineos-grenadiers-20", "team-jumbo-visma-20", "trek-segafredo-20", "uae-team-emirates-20", "retired", "unsigned", "non-WT-team"])
      .range(["#edb126", "#cb0713", "#de1109", "#02132b", "#019c7f", "#e41921", "#14b9d0", 
              "#000000", "#f6217f", "#044b9b", "#000000", "#f7571c", "#573117", "#dc0716", "#00baf2", 
              "#d1001e", "#000000", "#075ba1", "#636363", "#282828", "#204a95",
              "#edb126", "#cb0713", "#de1109", "#02132b", "#019c7f", "#14b9d0", "#e41921", 
              "#000000", "#f6217f", "#044b9b", "#000000", "#573117", "#dc0716", "#00baf2", 
              "#d1001e", "#000000", "#075ba1", "#c4f551", "#636363", "#404040", "#878787", "#204a95"]);

    function addGradientStop(gradients, offset, fn) {
        return gradients.append("stop")
                        .attr("offset", offset)
                        .attr("stop-color", fn);
    }

    function color(index) {
        let ratio = index / (data.nodes.length - 1.0);
        return colorScale(ratio);
    }
    
    function darkenColor(color, factor) {
        return d3.color(color).darker(factor)
    }
    
    function getGradientId(d) {
        return `gradient_${d.source.id}_${d.target.id}`;
    }
    
    function mouseoverLink(d) {

      var linkHover = this;

      svg.selectAll("path.link")
        .filter(function(d) { return (this !== linkHover); })
        .transition().duration(200)
        .attr("stroke-opacity", 0.2);
      d3.select(this)
        .transition().duration(200)
        .attr("stroke-opacity", linkOpacityHover);

      d3.select("#tooltip")
        .style("left", (d3.event.pageX - 20) + "px")   
        .style("top", (d3.event.pageY + 20) + "px")
        .html('<p class= "tooltip-rider">' + d.rider + "</p><br>" + 
            '<p class= "tooltip-team">' + d.team_name_2020 + arrow + d.team_name_2021 + "</p>")
        .classed("hidden", false);
    }
    
    function mouseoutLink(d) {
      
      svg.selectAll("path.link")
          .transition().duration(200)
          .attr("stroke-opacity", linkOpacity);
      
      d3.select("#tooltip").classed("hidden", true);
    
    }

    //learning some javascript to link captions with data:)
    function mergeArray(captions, data){
        return captions.map((item, i) => {
          if(item.id === data.nodes[i].id){
            return Object.assign({}, item, data[i])
        }
      })
    }; 

    //functions that get fed into mouse hover functions below (pulled out because repeated for rect and logo elements)
    function targetLinks(node){
      svgLinks.selectAll("path.link")
            .filter((link) => { return node.targetLinks.indexOf(link) !== -1;})
            .transition().duration(200)
            .attr("stroke-opacity", linkOpacityHover);
    }

    function sourceLinks(node){
      svgLinks.selectAll("path.link")
            .filter((link) => { return node.sourceLinks.indexOf(link) !== -1;})
            .transition().duration(200)
            .attr("stroke-opacity", linkOpacityHover);
    }

    function nonLinks(node){
      svgLinks.selectAll("path.link")
            .filter((link) => { return node.sourceLinks.indexOf(link) == -1 & node.targetLinks.indexOf(link) == -1; })
            .transition()
            .duration(200)
            .attr("stroke-opacity", 0.2);
    }

    function mouseoverNode(node, d) {

      let targetlinks = targetLinks(node);
      let nonlinks = nonLinks(node);
      let links = sourceLinks(node);
      var nodeHover = this;

      svg.selectAll("rect.node")
          .filter(function(d) { return (this !== nodeHover); })
          .transition().duration(200)
          .attr("opacity", linkOpacityHover);
      
      d3.select(this)
        .transition().duration(200)
        .attr("opacity", linkOpacityHover); 

      var tooltip = mergeArray(captions, data);

      console.log(tooltip);
      d3.select("#default")
          .classed("hidden", true);

      d3.select("#teamCaption")
          .html('<p>' + tooltip[d].caption + "</p>")
          .classed("hidden", false);

      d3.select("#riderIn")
          .html('<p style="font-family: calder-script, sans-serif;font-size: calc(6px + (20 - 6) * ((100vw - 300px) / (1600 - 300))); line-height: 0.5;">' + "NEW BLOOD </p><br><p>" + tooltip[d].in.join("<br>") + "</p>")
          .classed("hidden", false);

      d3.select("#riderOut")
          .html('<p style="font-family: calder-script, sans-serif;font-size: calc(6px + (20 - 6) * ((100vw - 300px) / (1600 - 300))); line-height: 0.5;">' + "LEFT</p><br><p>" + tooltip[d].out.join("<br>") + "</p>")
          .classed("hidden", false);

      d3.select("#riderStay")
          .html('<p style="font-family: calder-script, sans-serif; font-size: calc(6px + (20 - 6) * ((100vw - 300px) / (1600 - 300)));  line-height: 0.5;">' + "STUCK AROUND </p><br><p>" + tooltip[d].stay.join("<br>") + "</p>")
          .classed("hidden", false);

    }

    function mouseoutNode() {
      svgLinks.selectAll("path.link")
        .transition().duration(200)
        .attr("stroke-opacity", linkOpacity);
      svg.selectAll("rect.node")
        .transition().duration(200)
        .attr("opacity", nodeOpacity);
              d3.select("#default")
          .classed("hidden", false);

      d3.select("#teamCaption")
        .classed("hidden", true);

      d3.select("#riderIn")
        .classed("hidden", true);

      d3.select("#riderOut")
        .classed("hidden", true);

      d3.select("#riderStay")
        .classed("hidden", true);
    }

    function mouseoverLogo(node, d) {

      let targetlinks = targetLinks(node);
      let nonlinks = nonLinks(node);
      let links = sourceLinks(node);
      var tooltip = mergeArray(captions, data);

      d3.select("#default")
          .classed("hidden", true);

      d3.select("#teamCaption")
        .html('<p>' + tooltip[d].caption + "</p>")
        .classed("hidden", false);

      d3.select("#riderIn")
          .html('<p style="font-family: calder-script, sans-serif;font-size: calc(6px + (20 - 6) * ((100vw - 300px) / (1600 - 300))); line-height: 0.5;">' + "NEW BLOOD </p><br><p>" + tooltip[d].in.join("<br>") + "</p>")
          .classed("hidden", false);

      d3.select("#riderOut")
          .html('<p style="font-family: calder-script, sans-serif;font-size: calc(6px + (20 - 6) * ((100vw - 300px) / (1600 - 300))); line-height: 0.5;">' + "LEFT</p><br><p>" + tooltip[d].out.join("<br>") + "</p>")
          .classed("hidden", false);

      d3.select("#riderStay")
          .html('<p style="font-family: calder-script, sans-serif; font-size: calc(6px + (20 - 6) * ((100vw - 300px) / (1600 - 300))); line-height: 0.5;">' + "STUCK AROUND </p><br><p>" + tooltip[d].stay.join("<br>") + "</p>")
          .classed("hidden", false);

    }
  
    function mouseoutLogo() {
      svgLinks.selectAll("path.link")
          .transition().duration(200)
          .attr("stroke-opacity", linkOpacity);

      d3.select("#default")
          .classed("hidden", false);

      d3.select("#teamCaption")
        .classed("hidden", true);

      d3.select("#riderIn")
        .classed("hidden", true);

      d3.select("#riderOut")
        .classed("hidden", true);

      d3.select("#riderStay")
        .classed("hidden", true);
    }
 
    function reduceUnique(previous, current) {
        if (previous.indexOf(current) < 0) {
            previous.push(current);
        }
        return previous;
    }
    
        
    function sumValues(previous, current) {
        previous += current;
        return previous;
    }
    

    //set up svg
    const svg = d3.select("#canvas")
                  .attr("viewBox", `0 0 ${width} ${height}`)
                  .style("background-color", svgBackground)
                  .attr("transform", "translate(0," + height + ")rotate(-270)")
                  .append("g");
    
    // Define our sankey instance
    const graphSize = [width/3.5, height];
    const sankey = d3.sankey()
                     .size(graphSize)
                     .nodeId(d => d.id)
                     .nodeWidth(nodeWidth)
                     .nodePadding(nodePadding)
                     .nodeAlign(nodeAlignment)
                     .nodeSort(function(a, b) {return d3.ascending(a.value, b.value); });
    let graph = sankey(data);
    console.log(graph);
    // Loop through the nodes
    graph.nodes.forEach(node => {
        let fillColor = color(node.index);
        node.fillColor = fillColor;
        node.strokeColor = darkenColor(fillColor, nodeDarkenFactor);
        node.width = node.x1 - node.x0;
        node.height = node.y1 - node.y0;
    });
    
    //create a transparent "wide node" to hold team logo (allows it to be connected to links for hover purposes)    
    let svgNodeswide = svg.append("g")
                      .classed("nodes", true)
                      .selectAll("g")
                      .data(graph.nodes)
                      .enter()
                      .append("g")

        svgNodeswide.append('svg:image')
                      .classed("logo", true)
                      .attr("x", d => d.x0)
                      .attr("y", d => d.y0+2)
                      .attr("width", d => d.height)
                      .attr("height", d => d.width*margin_x/2)
                      .attr("transform", function(d){
                          return "translate(-14, " + d.height + ")rotate(270," + d.x0 + "," + d.y0 + ")" ;})
                      .filter(function(d) { return d.x0 < width / 4; })
                      .attr('href', function(d,i) { return "imgs/" + d.id + '.png';}) 
                      .attr("opacity", 1)
                      .attr("stroke", "black")
                      .attr("stroke-width", 0);

        svgNodeswide.append("rect")
                      .classed("logo", true)
                      .attr("x", d => d.x0-20)
                      .attr("y", d => d.y0)
                      .attr("width", d => d.width*margin_x/2)
                      .attr("height", d => d.height)
                      .filter(function(d) { return d.x0 < width ; })
                      .attr("fill", d => "white")
                      .attr("opacity", 0)
                      .attr("stroke", "black")
                      .attr("stroke-width", 0)
                      .on("mouseover", mouseoverLogo)
                      .on("mouseout", mouseoutLogo);
    //regular sankey nodes
    let svgNodes = svg.append("g")
                      .classed("nodes", true)
                      .selectAll("rect")
                      .data(graph.nodes)
                      .enter()
                      .append("rect")
                      .classed("node", true)
                      .attr("x", d => d.x0)
                      .attr("y", d => d.y0)
                      .attr("width", d => d.width)
                      .attr("height", d => d.height)
                      .attr("fill", d => d.fillColor)
                      .attr("opacity", nodeOpacity)
                      .attr("stroke", d => d.strokeColor)
                      .attr("stroke-width", 0)
                      .on("mouseover", mouseoverNode)
                      .on("mouseout", mouseoutNode);

    // Build the links
    let svgLinks = svg.append("g")
                      .classed("links", true)
                      .selectAll("g")
                      .data(graph.links)
                      .enter()
                      .append("g");
    let gradients = svgLinks.append("linearGradient")
                            .attr("gradientUnits", "userSpaceOnUse")
                            .attr("x1", d => d.source.x1)
                            .attr("x2", d => d.target.x0)
                            .attr("id", d => getGradientId(d));
    addGradientStop(gradients, 0.0, d => color(d.source.index));
    addGradientStop(gradients, 1.0, d => color(d.target.index));

    svgLinks.append("path")
            .classed("link", true)
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", d => `url(#${getGradientId(d)})`)
            .attr("stroke-width", d => Math.max(0, d.width))
            .attr("stroke-opacity", linkOpacity)
            .on("mouseout", mouseoutLink)
            .on("mouseover", mouseoverLink);

    let nodeDepths = graph.nodes
        .map(n => n.depth)
        .reduce(reduceUnique, []);
    
    nodeDepths.forEach(d => {
        let nodesAtThisDepth = graph.nodes.filter(n => n.depth === d);
        let numberOfNodes = nodesAtThisDepth.length;
        let totalHeight = nodesAtThisDepth
                            .map(n => n.height)
                            .reduce(sumValues, 0);
        let whitespace = graphSize[1] - totalHeight;
        let balancedWhitespace = whitespace / (numberOfNodes + 1.0);
        console.log("depth", d, "total height", totalHeight, "whitespace", whitespace, "balanced whitespace", balancedWhitespace);
    });
    
})();
