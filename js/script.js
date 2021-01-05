(function () {
    
    const margin_x = 30;
    const margin_y = 2;
    const width = 200;
    const height = 100;
    const nodeWidth = 1.3;
    const nodePadding = 1;
    const nodeOpacity = 0.7;
    const linkOpacity = 0.7;
    const nodeDarkenFactor = 3;
    const nodeStrokeWidth = 0;
    const linkOpacityHover = 0.9;
    const arrow = "\u2192";
    const nodeAlignment = d3.sankeyJustify;
    const path = d3.sankeyLinkHorizontal();
    let initialMousePosition = {};
    let initialNodePosition = {};

    /* team colors */
    let colorScale = d3.scaleOrdinal()
      .domain(["ag2r-citroen-team", "astana-premier-tech", "bahrain-victorious", "bora-hansgrohe", "cofidis-solutions-credits","deceuninck-quick-step","ef-education-nippo",
               "greenedge-cycling","groupama-fdj","intermarche-wanty-gobert", "israel-start-up-nation-20","lotto-soudal","movistar-team","team-dsm",
                "team-ineos","team-jumbo-visma","team-qhubeka-assos","trek-segafredo","uae-team-emirates","non-WT-team-20","neo-pro",
                "ag2r-la-mondiale", "astana-pro-team", "bahrain-mclaren", "bora-hansgrohe-20", "ccc-team", "cofidis-solutions-credits-20", "deceuninck-quick-step-20", 
                "ef-pro-cycling", "groupama-fdj-20", "mitchelton-scott", "ntt-pro-cycling", "israel-start-up-nation-20", "lotto-soudal-20", "movistar-team-20", 
                "team-sunweb", "Ineos-grenadiers", "team-jumbo-visma-20", "trek-segafredo-20", "uae-team-emirates-20", "retired", "unsigned", "non-WT-team"])
      .range(["#edb126", "#cb0713", "#de1109", "#02132b", "#019c7f", "#14b9d0", "#e41921", 
              "#000000", "#f6217f", "#044b9b", "#000000", "#f7571c", "#573117", "#dc0716", "#00baf2", 
              "#d1001e", "#000000", "#075ba1", "#636363", "#282828", "#204a95",
              "#edb126", "#cb0713", "#de1109", "#02132b", "#019c7f", "#14b9d0", "#e41921", 
              "#000000", "#f6217f", "#044b9b", "#000000", 			 "#573117", "#dc0716", "#00baf2", 
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
    
    
    function getNodePosition(node) {
        return {
            x: +node.attr("x"),
            y: +node.attr("y"),
            width: +node.attr("width"),
            height: +node.attr("height")
        };
    }

    function mouseoverLink(d) {

    	var linkHover = this;

   		svg.selectAll("path.link")
    		.filter(function(d) { return (this !== linkHover); })
    		.transition().duration(200)
    		.attr("stroke-opacity", 0.4);
  		d3.select(this)
    		.transition().duration(200)
        .attr("stroke-opacity", linkOpacityHover);

      d3.select("#tooltip")
      	 .style("left", (d3.event.pageX - 20) + "px")   
      	 .style("top", (d3.event.pageY + 20) + "px")
      	 .html('<p class= "tooltip-rider">' + d.rider + "<br>" + 
        		    + d.team_name_2020 + arrow + d.team_name_2021 + "</p>")
    	d3.select("#tooltip").classed("hidden", false);

    }
    
  function mouseoutLink(d) {
  	svg.selectAll("path.link")
  			.transition().duration(200)
    		.attr("stroke-opacity", linkOpacity);
  	d3.select("#tooltip").classed("hidden", true);
	}

  function branchAnimate(node) {
    
    let links = svgLinks.selectAll("path.link")
      .filter((link) => {
        return node.sourceLinks.indexOf(link) !== -1;
      });
    links.transition().duration(10)
    	 .attr("stroke-opacity", 0.8);

    let targetlinks = svgLinks.selectAll("path.link")
      .filter((link) => {
        return node.targetLinks.indexOf(link) !== -1;
      });

    targetlinks.transition().duration(200)
    .attr("stroke-opacity", 1);

    let nonlinks = svgLinks.selectAll("path.link")
      .filter((link) => {
        return node.sourceLinks.indexOf(link) == -1 & node.targetLinks.indexOf(link) == -1;
      });

    nonlinks.transition()
    		.duration(200)
    		.attr("stroke-opacity", 0.2)
      ;
  
  	var nodeHover = this;

   		svg.selectAll("rect.node")
    		.filter(function(d) { return (this !== nodeHover); })
    		.transition().duration(200)
    		.attr("opacity", 0.6);
  		d3.select(this)
    		.transition().duration(200)
        .attr("opacity", 0.9);
      
      d3.select("#tooltip")
         .style("left", (d3.event.pageX - 20) + "px")   
         .style("top", (d3.event.pageY + 20) + "px")
         .html('<p class= "tooltip-rider">' + d.rider + "</p>" +   "<br/>" + 
            '<p class= "tooltip-team">' + d.team_name_2020 + arrow + d.team_name_2021 + "</p>")
      d3.select("#tooltip").classed("hidden", false);

  }
  
  function branchClear() {
    svgLinks.selectAll("path.link")
    		.transition().duration(200)
    		.attr("stroke-opacity", linkOpacity);
    svg.selectAll("rect.node")
  			.transition().duration(200)
    		.attr("opacity", 0.8);
  }

function logoAnimate(node) {
    
    let links = svgLinks.selectAll("path.link")
      .filter((link) => {
        return node.sourceLinks.indexOf(link) !== -1;
      });
    links.transition().duration(10)
    	 .attr("stroke-opacity", 0.8);

    let targetlinks = svgLinks.selectAll("path.link")
      .filter((link) => {
        return node.targetLinks.indexOf(link) !== -1;
      });

    targetlinks.transition().duration(200)
    .attr("stroke-opacity", 1);

    let nonlinks = svgLinks.selectAll("path.link")
      .filter((link) => {
        return node.sourceLinks.indexOf(link) == -1 & node.targetLinks.indexOf(link) == -1;
      });

    nonlinks.transition()
    		.duration(200)
    		.attr("stroke-opacity", 0.2)
      ;
  
  }
  
  function logoClear() {
    svgLinks.selectAll("path.link")
    		.transition().duration(200)
    		.attr("stroke-opacity", linkOpacity);
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
    
    const data = {
        nodes: [
            { id: "deceuninck-quick-step-20" },
            { id: "team-jumbo-visma-20" },
            { id: "uae-team-emirates-20" },
            { id: "team-sunweb" },  
            { id: "Ineos-grenadiers" },
            { id: "bora-hansgrohe-20" },
            { id: "astana-pro-team" },
            { id: "trek-segafredo-20" },
            { id: "mitchelton-scott" },                                   
            { id: "ef-pro-cycling" },
            { id: "groupama-fdj-20" },
            { id: "bahrain-mclaren" },
            { id: "ccc-team" },                                    
            { id: "ag2r-la-mondiale" },
            { id: "lotto-soudal-20" },
            { id: "movistar-team-20" },
            { id: "cofidis-solutions-credits-20" },
            { id: "ntt-pro-cycling" },
            { id: "israel-start-up-nation-20" },
            { id: "non-WT-team-20" },
            { id: "neo-pro" },

            { id: "deceuninck-quick-step" },
            { id: "team-jumbo-visma" },
            { id: "uae-team-emirates" },
            { id: "team-dsm" },
            { id: "team-ineos" },
            { id: "bora-hansgrohe" },
            { id: "astana-premier-tech" },
            { id: "trek-segafredo" },
            { id: "greenedge-cycling" },
            { id: "ef-education-nippo" },
            { id: "groupama-fdj" }, 
            { id: "bahrain-victorious" },                                                                                                                                   
            { id: "ag2r-citroen-team" },
            { id: "lotto-soudal" },
            { id: "movistar-team" },
            { id: "cofidis-solutions-credits" },
            { id: "team-qhubeka-assos" },
            { id: "israel-start-up-nation" },
            { id: "intermarche-wanty-gobert" },
            { id: "non-WT-team" },
            { id: "unsigned" },
            { id: "retired" }
        ],
        links: [
{"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"alaphilippe julian","value":1795.8,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"almeida joão","value":1370.3,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"archbold shane","value":175,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"asgreen kasper","value":665,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"bagioli andrea","value":369.3,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"ballerini davide","value":458,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"bennett sam","value":963,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"cattaneo mattia","value":107,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"cavagna rémi","value":395,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"declercq tim","value":415,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"devenyns dries","value":466,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"evenepoel remco","value":1193,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"garrison ian","value":8,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"hodeg álvaro josé","value":63.8,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"honoré mikkel frølich","value":133.1,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"jakobsen fabio","value":345,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"keisse iljo","value":79,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"knox james","value":245.3,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"lampaert yves","value":1175,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"masnada fausto","value":483,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"mørkøv michael","value":145,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"sénéchal florian","value":1325,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"serry pieter","value":114.3,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"steels stijn","value":10,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"steimle jannik","value":197.8,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"štybar zdeněk","value":306,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"van lerberghe bert","value":122.8,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"deceuninck-quick-step","rider":"vansevenant mauri","value":2.3,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"deceuninck-quick-step-20","target":"ag2r-citroen-team","rider":"jungels bob","value":195.8,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"AG2R Citroën Team"},
         {"source":"deceuninck-quick-step-20","target":"non-WT-team","rider":"quinn sean","value":5,"team_name_2020":"Deceuninck - Quick Step ('20)","team_name_2021":"non-World Tour team ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"bennett george","value":1100,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"bouwman koen","value":62,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"dumoulin tom","value":700,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"eenkhoorn pascal","value":157,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"foss tobias","value":108,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"gesink robert","value":53,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"groenewegen dylan","value":95,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"harper chris","value":70,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"hofstede lennard","value":30,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"kruijswijk steven","value":60,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"kuss sepp","value":351,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"martens paul","value":10,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"martin tony","value":10,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"pfingsten christoph","value":10,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"roglič primož","value":4237,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"roosen timo","value":176,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"teunissen mike","value":257,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"tolhoek antwan","value":125,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"van aert wout","value":2700,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"van emden jos","value":40,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"vingegaard jonas","value":116,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-jumbo-visma","rider":"wynants maarten","value":10,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-jumbo-visma-20","target":"team-ineos","rider":"de plus laurens","value":10,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team INEOS"},
         {"source":"team-jumbo-visma-20","target":"greenedge-cycling","rider":"jansen amund grøndahl","value":15,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"GreenEDGE Cycling"},
         {"source":"team-jumbo-visma-20","target":"team-qhubeka-assos","rider":"lindeman bert-jan","value":65,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"team-jumbo-visma-20","target":"retired","rider":"leezer tom","value":10,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"team-jumbo-visma-20","target":"non-WT-team","rider":"van der hoorn taco","value":52,"team_name_2020":"Team Jumbo-Visma ('20)","team_name_2021":"non-World Tour team ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"ardila andrés camilo","value":3,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"bjerg mikkel","value":56,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"bystrøm sven erik","value":286,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"conti valerio","value":148,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"costa rui","value":559,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"covi alessandro","value":192,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"de la cruz david","value":370,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"dombrowski joe","value":21,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"formolo davide","value":438,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"gaviria fernando","value":349,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"kristoff alexander","value":857,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"laengen vegard stake","value":15,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"marcato marco","value":23,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"mcnulty brandon","value":294,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"mirza yousif","value":10,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"molano juan sebastián","value":64,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"muñoz cristian camilo","value":9,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"oliveira ivo","value":50,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"oliveira rui","value":33,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"pogačar tadej","value":3055,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"riabushenko alexandr","value":308,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"richeze maximiliano","value":5,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"troia oliviero","value":10,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"uae-team-emirates","rider":"ulissi diego","value":1671,"team_name_2020":"UAE-Team Emirates","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"uae-team-emirates-20","target":"cofidis-solutions-credits","rider":"bohli tom","value":10,"team_name_2020":"UAE-Team Emirates","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"uae-team-emirates-20","target":"team-qhubeka-assos","rider":"aru fabio","value":125,"team_name_2020":"UAE-Team Emirates","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"uae-team-emirates-20","target":"team-qhubeka-assos","rider":"henao sergio","value":158,"team_name_2020":"UAE-Team Emirates","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"uae-team-emirates-20","target":"unsigned","rider":"polanc jan","value":200,"team_name_2020":"UAE-Team Emirates","team_name_2021":"Retired/unsigned"},
         {"source":"uae-team-emirates-20","target":"non-WT-team","rider":"philipsen jasper","value":602,"team_name_2020":"UAE-Team Emirates","team_name_2021":"non-World Tour team ('21)"},
         {"source":"uae-team-emirates-20","target":"non-WT-team","rider":"ravasi edward","value":23,"team_name_2020":"UAE-Team Emirates","team_name_2021":"non-World Tour team ('21)"},
         {"source":"team-sunweb","target":"team-jumbo-visma","rider":"oomen sam","value":120,"team_name_2020":"Team Sunweb","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"team-sunweb","target":"team-dsm","rider":"arensman thymen","value":36,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"arndt nikias","value":33,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"benoot tiesj","value":780,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"bol cees","value":128,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"dainese alberto","value":104,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"denz nico","value":104.7,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"donovan mark","value":35,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"eekhoff nils","value":348,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"gall felix","value":10,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"haga chad","value":105.7,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"hamilton chris","value":73,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"hindley jai","value":1155,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"hirschi marc","value":1430,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"kanter max","value":64.7,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"kragh andersen søren","value":1008,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"kragh andersen asbjørn","value":40.7,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"nieuwenhuis joris","value":135.7,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"pedersen casper","value":221,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"roche nicolas","value":155,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"salmon martin","value":10,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"storer michael","value":102.7,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"stork florian","value":37,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"sütterlin jasha","value":92,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"tusveld martijn","value":27,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"van wilder ilan","value":38,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"team-dsm","rider":"vermaerke kevin","value":15,"team_name_2020":"Team Sunweb","team_name_2021":"Team DSM"},
         {"source":"team-sunweb","target":"bora-hansgrohe","rider":"kelderman wilco","value":1328,"team_name_2020":"Team Sunweb","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"team-sunweb","target":"greenedge-cycling","rider":"matthews michael","value":1022,"team_name_2020":"Team Sunweb","team_name_2021":"GreenEDGE Cycling"},
         {"source":"team-sunweb","target":"team-qhubeka-assos","rider":"power robert","value":119,"team_name_2020":"Team Sunweb","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"amador andrey","value":10,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"basso leonardo","value":10,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"bernal egan","value":425.5,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"carapaz richard","value":1406.5,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"castroviejo jonathan","value":87,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"dennis rohan","value":550,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"doull owain","value":77.8,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"dunbar eddie","value":241,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"ganna filippo","value":1068,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"geoghegan hart tao","value":1292,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"gołaś michał","value":40,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"hayter ethan","value":327.8,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"henao sebastián","value":10,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"kwiatkowski michał","value":963,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"moscon gianni","value":8,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"narváez jhonatan","value":333.3,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"puccio salvatore","value":54,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"rivera brandon smith","value":20.3,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"rodriguez carlos","value":17,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"rowe luke","value":71,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"sivakov pavel","value":460,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"sosa iván ramiro","value":35.8,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"swift ben","value":186.8,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"thomas geraint","value":602,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"team-ineos","rider":"van baarle dylan","value":528,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Team INEOS"},
         {"source":"Ineos-grenadiers","target":"israel-start-up-nation","rider":"froome chris","value":10,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"Ineos-grenadiers","target":"retired","rider":"kiryienka vasil","value":10,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Retired/unsigned"},
         {"source":"Ineos-grenadiers","target":"unsigned","rider":"knees christian","value":7,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Retired/unsigned"},
         {"source":"Ineos-grenadiers","target":"retired","rider":"stannard ian","value":5,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Retired/unsigned"},
         {"source":"Ineos-grenadiers","target":"unsigned","rider":"wurf cameron","value":10,"team_name_2020":"INEOS Grenadiers","team_name_2021":"Retired/unsigned"},
         {"source":"Ineos-grenadiers","target":"non-WT-team","rider":"lawless chris","value":5,"team_name_2020":"INEOS Grenadiers","team_name_2021":"non-World Tour team ('21)"},
         {"source":"bora-hansgrohe-20","target":"uae-team-emirates","rider":"majka rafał","value":835,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"ackermann pascal","value":1248,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"baška erik","value":90,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"benedetti cesare","value":26.5,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"bodnar maciej","value":30,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"buchmann emanuel","value":185,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"burghardt marcus","value":53.5,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"fabbro matteo","value":102,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"gamper patrick","value":30.5,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"großschartner felix","value":366,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"kämna lennard","value":595,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"konrad patrick","value":575,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"laas martin","value":41,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"oss daniel","value":18,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"pöstlberger lukas","value":43,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"sagan peter","value":860,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"sagan juraj","value":125.5,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"schachmann maximilian","value":1360,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"schelling ide","value":34.5,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"schillinger andreas","value":3,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"schwarzmann michael","value":38,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"bora-hansgrohe","rider":"selig rüdiger","value":10,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"bora-hansgrohe-20","target":"movistar-team","rider":"mühlberger gregor","value":352,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"bora-hansgrohe-20","target":"cofidis-solutions-credits","rider":"drucker jempy","value":362.5,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"bora-hansgrohe-20","target":"retired","rider":"gatto oscar","value":25,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"bora-hansgrohe-20","target":"unsigned","rider":"mccarthy jay","value":164,"team_name_2020":"BORA - hansgrohe ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"aranburu alex","value":410,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"boaro manuele","value":45,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"contreras rodrigo","value":15,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"felline fabio","value":197,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"fraile omar","value":146,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"fuglsang jakob","value":1961,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"gidich yevgeniy","value":8,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"gregaard jonas","value":30,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"gruzdev dmitriy","value":10,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"houle hugo","value":110,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"izagirre ion","value":333,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"izagirre gorka","value":498,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"kudus merhawi","value":70,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"lutsenko alexey","value":531,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"martinelli davide","value":5,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"natarov yuriy","value":13,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"pronskiy vadim","value":40,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"rodríguez óscar","value":116,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"sánchez luis león","value":212,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"stalnov nikita","value":50,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"tejada harold","value":73,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"vlasov aleksandr","value":1399,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"astana-premier-tech","rider":"zakharov artyom","value":11,"team_name_2020":"Astana Pro Team","team_name_2021":"Astana - Premier Tech"},
         {"source":"astana-pro-team","target":"movistar-team","rider":"lópez miguel ángel","value":925,"team_name_2020":"Astana Pro Team","team_name_2021":"Movistar Team ('21)"},
         {"source":"astana-pro-team","target":"retired","rider":"bizhigitov zhandos","value":10,"team_name_2020":"Astana Pro Team","team_name_2021":"Retired/unsigned"},
         {"source":"astana-pro-team","target":"unsigned","rider":"bohórquez hernando","value":8,"team_name_2020":"Astana Pro Team","team_name_2021":"Retired/unsigned"},
         {"source":"astana-pro-team","target":"unsigned","rider":"de vreese laurens","value":3,"team_name_2020":"Astana Pro Team","team_name_2021":"Retired/unsigned"},
         {"source":"astana-pro-team","target":"unsigned","rider":"fominykh daniil","value":10,"team_name_2020":"Astana Pro Team","team_name_2021":"Retired/unsigned"},
         {"source":"trek-segafredo-20","target":"team-ineos","rider":"porte richie","value":1733,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Team INEOS"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"bernard julien","value":39,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"brambilla gianluca","value":187,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"ciccone giulio","value":575,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"conci nicola","value":174,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"de kort koen","value":10,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"eg niklas","value":82,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"elissonde kenny","value":150,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"kamp alexander","value":10,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"kirsch alex","value":142,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"liepiņš emīls","value":83,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"lópez juan pedro","value":27,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"mollema bauke","value":420,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"mosca jacopo","value":325,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"moschetti matteo","value":255,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"mullen ryan","value":15,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"nibali vincenzo","value":1114,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"nibali antonio","value":20,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"pedersen mads","value":1037,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"quarterman charlie","value":10,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"reijnen kiel","value":3,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"ries michel","value":44,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"simmons quinn","value":260,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"skjelmose jensen mattias","value":3,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"skujiņš toms","value":91,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"stuyven jasper","value":685,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"theuns edward","value":72,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"trek-segafredo","rider":"tiberi antonio","value":41,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"trek-segafredo-20","target":"unsigned","rider":"clarke will","value":10,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"trek-segafredo-20","target":"retired","rider":"weening pieter","value":15,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"trek-segafredo-20","target":"non-WT-team","rider":"fancellu alessandro","value":70,"team_name_2020":"Trek - Segafredo ('20)","team_name_2021":"non-World Tour team ('21)"},
         {"source":"mitchelton-scott","target":"team-jumbo-visma","rider":"affini edoardo","value":82.3,"team_name_2020":"Mitchelton-Scott","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"mitchelton-scott","target":"team-ineos","rider":"yates adam","value":738,"team_name_2020":"Mitchelton-Scott","team_name_2021":"Team INEOS"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"bauer jack","value":99,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"bewley sam","value":10,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"bookwalter brent","value":100,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"chaves esteban","value":327,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"durbridge luke","value":148,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"edmondson alex","value":10,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"grmay tsgabu","value":21,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"groves kaden","value":114,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"hamilton lucas","value":251,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"hepburn michael","value":30,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"howson damien","value":294,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"juul-jensen christopher","value":10,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"konychev alexander","value":21,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"meyer cameron","value":110,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"mezgec luka","value":545,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"nieve mikel","value":219,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"peák barnabás","value":90,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"schultz nick","value":82,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"scotson callum","value":10,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"smith dion","value":491,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"stannard robert","value":254,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"yates simon","value":1076,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"greenedge-cycling","rider":"zeits andrey","value":30,"team_name_2020":"Mitchelton-Scott","team_name_2021":"GreenEDGE Cycling"},
         {"source":"mitchelton-scott","target":"bahrain-victorious","rider":"haig jack","value":435,"team_name_2020":"Mitchelton-Scott","team_name_2021":"Bahrain - Victorious"},
         {"source":"mitchelton-scott","target":"israel-start-up-nation","rider":"impey daryl","value":575,"team_name_2020":"Mitchelton-Scott","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"mitchelton-scott","target":"retired","rider":"albasini michael","value":53,"team_name_2020":"Mitchelton-Scott","team_name_2021":"Retired/unsigned"},
         {"source":"ef-pro-cycling","target":"team-ineos","rider":"martínez daniel felipe","value":981.3,"team_name_2020":"EF Pro Cycling","team_name_2021":"Team INEOS"},
         {"source":"ef-pro-cycling","target":"greenedge-cycling","rider":"kangert tanel","value":430,"team_name_2020":"EF Pro Cycling","team_name_2021":"GreenEDGE Cycling"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"bettiol alberto","value":649,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"bissegger stefan","value":204.6,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"carthy hugh","value":821,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"cort magnus","value":142,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"craddock lawson","value":7.3,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"guerreiro ruben","value":306,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"higuita sergio","value":602.3,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"hofland moreno","value":6,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"howes alex","value":10,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"keukeleire jens","value":207,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"langeveld sebastian","value":11,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"morton lachlan","value":3,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"owen logan","value":10,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"powless neilson","value":146,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"rutsch jonas","value":5,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"scully tom","value":15,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"urán rigoberto","value":352.3,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"van den berg julius","value":10,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"van garderen tejay","value":2.3,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"ef-education-nippo","rider":"whelan james","value":19,"team_name_2020":"EF Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ef-pro-cycling","target":"team-qhubeka-assos","rider":"bennett sean","value":55,"team_name_2020":"EF Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ef-pro-cycling","target":"team-qhubeka-assos","rider":"clarke simon","value":308,"team_name_2020":"EF Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ef-pro-cycling","target":"israel-start-up-nation","rider":"vanmarcke sep","value":96,"team_name_2020":"EF Pro Cycling","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"ef-pro-cycling","target":"israel-start-up-nation","rider":"woods michael","value":920,"team_name_2020":"EF Pro Cycling","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"ef-pro-cycling","target":"unsigned","rider":"caicedo jonathan klever","value":184.3,"team_name_2020":"EF Pro Cycling","team_name_2021":"Retired/unsigned"},
         {"source":"ef-pro-cycling","target":"unsigned","rider":"docker mitchell","value":5,"team_name_2020":"EF Pro Cycling","team_name_2021":"Retired/unsigned"},
         {"source":"ef-pro-cycling","target":"unsigned","rider":"villalobos luis","value":10,"team_name_2020":"EF Pro Cycling","team_name_2021":"Retired/unsigned"},
         {"source":"ef-pro-cycling","target":"non-WT-team","rider":"halvorsen kristoffer","value":65,"team_name_2020":"EF Pro Cycling","team_name_2021":"non-World Tour team ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"armirail bruno","value":103,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"bonnet william","value":10,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"brunel alexys","value":96,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"davy clément","value":10,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"delage mickaël","value":10,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"démare arnaud","value":1550,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"duchesne antoine","value":10,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"gaudu david","value":635,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"geniets kevin","value":205,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"guarnieri jacopo","value":8,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"guglielmi simon","value":45,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"konovalovas ignatas","value":3,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"küng stefan","value":1133,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"ladagnous matthieu","value":10,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"le gac olivier","value":65,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"lienhard fabian","value":118,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"ludvigsson tobias","value":36,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"madouas valentin","value":426,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"molard rudy","value":428,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"pinot thibaut","value":863,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"reichenbach sébastien","value":141,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"roux anthony","value":115,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"scotson miles","value":15,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"seigle romain","value":63,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"sinkeldam ramon","value":8,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"stewart jake","value":123,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"groupama-fdj","rider":"thomas benjamin","value":83,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"groupama-fdj-20","target":"ag2r-citroen-team","rider":"sarreau marc","value":80,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"AG2R Citroën Team"},
         {"source":"groupama-fdj-20","target":"team-qhubeka-assos","rider":"frankiny kilian","value":67,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"groupama-fdj-20","target":"unsigned","rider":"vincent léo","value":3,"team_name_2020":"Groupama - FDJ ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"bahrain-mclaren","target":"deceuninck-quick-step","rider":"cavendish mark","value":10,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"arashiro yukiya","value":61,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"bauhaus phil","value":164,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"bilbao pello","value":685,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"buitrago santiago","value":60,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"capecchi eros","value":10,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"caruso damiano","value":448,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"colbrelli sonny","value":400,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"davies scott","value":10,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"feng chun kai","value":65,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"haller marco","value":95,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"haussler heinrich","value":70,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"inkelaar kevin","value":13,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"landa mikel","value":950,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"mohorič matej","value":471,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"novak domen","value":53,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"padun mark","value":40,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"pernsteiner hermann","value":348,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"poels wout","value":456,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"sieberg marcel","value":10,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"teuns dylan","value":460,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"tratnik jan","value":148,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"valls rafael","value":35,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"williams stephen","value":10,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"bahrain-victorious","rider":"wright alfred","value":23,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Bahrain - Victorious"},
         {"source":"bahrain-mclaren","target":"movistar-team","rider":"garcía cortina iván","value":304,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Movistar Team ('21)"},
         {"source":"bahrain-mclaren","target":"unsigned","rider":"bole grega","value":11,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Retired/unsigned"},
         {"source":"bahrain-mclaren","target":"unsigned","rider":"pibernik luka","value":15,"team_name_2020":"Bahrain - McLaren","team_name_2021":"Retired/unsigned"},
         {"source":"bahrain-mclaren","target":"non-WT-team","rider":"battaglin enrico","value":144,"team_name_2020":"Bahrain - McLaren","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ccc-team","target":"deceuninck-quick-step","rider":"černý josef","value":350,"team_name_2020":"CCC Team","team_name_2021":"Deceuninck - Quick Step ('21)"},
         {"source":"ccc-team","target":"team-jumbo-visma","rider":"van hooydonck nathan","value":55,"team_name_2020":"CCC Team","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"ccc-team","target":"uae-team-emirates","rider":"trentin matteo","value":651,"team_name_2020":"CCC Team","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"ccc-team","target":"ef-education-nippo","rider":"barta will","value":102,"team_name_2020":"CCC Team","team_name_2021":"EF Education - Nippo"},
         {"source":"ccc-team","target":"groupama-fdj","rider":"valter attila","value":270,"team_name_2020":"CCC Team","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"ccc-team","target":"ag2r-citroen-team","rider":"schär michael","value":20,"team_name_2020":"CCC Team","team_name_2021":"AG2R Citroën Team"},
         {"source":"ccc-team","target":"ag2r-citroen-team","rider":"van avermaet greg","value":650,"team_name_2020":"CCC Team","team_name_2021":"AG2R Citroën Team"},
         {"source":"ccc-team","target":"ag2r-citroen-team","rider":"van hoecke gijs","value":39,"team_name_2020":"CCC Team","team_name_2021":"AG2R Citroën Team"},
         {"source":"ccc-team","target":"lotto-soudal","rider":"małecki kamil","value":158,"team_name_2020":"CCC Team","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"ccc-team","target":"cofidis-solutions-credits","rider":"geschke simon","value":674,"team_name_2020":"CCC Team","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"ccc-team","target":"cofidis-solutions-credits","rider":"sajnok szymon","value":78,"team_name_2020":"CCC Team","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"ccc-team","target":"team-qhubeka-assos","rider":"wiśniowski łukasz","value":56,"team_name_2020":"CCC Team","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ccc-team","target":"israel-start-up-nation","rider":"bevin patrick","value":33,"team_name_2020":"CCC Team","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"ccc-team","target":"israel-start-up-nation","rider":"de marchi alessandro","value":195,"team_name_2020":"CCC Team","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"ccc-team","target":"intermarche-wanty-gobert","rider":"hirt jan","value":34,"team_name_2020":"CCC Team","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"ccc-team","target":"intermarche-wanty-gobert","rider":"koch jonas","value":8,"team_name_2020":"CCC Team","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"ccc-team","target":"intermarche-wanty-gobert","rider":"zimmermann georg","value":97,"team_name_2020":"CCC Team","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"ccc-team","target":"retired","rider":"pauwels serge","value":8,"team_name_2020":"CCC Team","team_name_2021":"Retired/unsigned"},
         {"source":"ccc-team","target":"unsigned","rider":"van keirsbulck guillaume","value":24,"team_name_2020":"CCC Team","team_name_2021":"Retired/unsigned"},
         {"source":"ccc-team","target":"unsigned","rider":"ventoso francisco josé","value":5,"team_name_2020":"CCC Team","team_name_2021":"Retired/unsigned"},
         {"source":"ccc-team","target":"non-WT-team","rider":"de la parte víctor","value":170,"team_name_2020":"CCC Team","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ccc-team","target":"non-WT-team","rider":"gradek kamil","value":58,"team_name_2020":"CCC Team","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ccc-team","target":"non-WT-team","rider":"kochetkov pavel","value":22,"team_name_2020":"CCC Team","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ccc-team","target":"non-WT-team","rider":"mareczko jakub","value":79,"team_name_2020":"CCC Team","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ccc-team","target":"non-WT-team","rider":"rosskopf joey","value":154,"team_name_2020":"CCC Team","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ccc-team","target":"non-WT-team","rider":"zakarin ilnur","value":162,"team_name_2020":"CCC Team","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ag2r-la-mondiale","target":"team-dsm","rider":"bardet romain","value":438,"team_name_2020":"AG2R La Mondiale","team_name_2021":"Team DSM"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"bidard françois","value":31,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"bouchard geoffrey","value":58,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"champoussin clément","value":86,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"cherel mikaël","value":68,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"cosnefroy benoît","value":1038,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"duval julien","value":23,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"frank mathias","value":20,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"gallopin tony","value":9,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"gastauer ben","value":25,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"godon dorian","value":180,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"gougeard alexis","value":66,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"hänninen jaakko","value":60,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"jullien anthony","value":13,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"naesen oliver","value":411,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"naesen lawrence","value":137,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"paret-peintre aurélien","value":256,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"peters nans","value":197,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"vendrame andrea","value":532,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"venturini clément","value":315,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"ag2r-citroen-team","rider":"warbasse larry","value":116,"team_name_2020":"AG2R La Mondiale","team_name_2021":"AG2R Citroën Team"},
         {"source":"ag2r-la-mondiale","target":"team-qhubeka-assos","rider":"tanfield harry","value":10,"team_name_2020":"AG2R La Mondiale","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ag2r-la-mondiale","target":"retired","rider":"chevrier clément","value":40,"team_name_2020":"AG2R La Mondiale","team_name_2021":"Retired/unsigned"},
         {"source":"ag2r-la-mondiale","target":"retired","rider":"domont axel","value":10,"team_name_2020":"AG2R La Mondiale","team_name_2021":"Retired/unsigned"},
         {"source":"ag2r-la-mondiale","target":"retired","rider":"vandenbergh stijn","value":10,"team_name_2020":"AG2R La Mondiale","team_name_2021":"Retired/unsigned"},
         {"source":"ag2r-la-mondiale","target":"unsigned","rider":"verger simon","value":10,"team_name_2020":"AG2R La Mondiale","team_name_2021":"Retired/unsigned"},
         {"source":"ag2r-la-mondiale","target":"non-WT-team","rider":"dillier silvan","value":124,"team_name_2020":"AG2R La Mondiale","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ag2r-la-mondiale","target":"non-WT-team","rider":"geniez alexandre","value":3,"team_name_2020":"AG2R La Mondiale","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ag2r-la-mondiale","target":"non-WT-team","rider":"jauregui quentin","value":33,"team_name_2020":"AG2R La Mondiale","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ag2r-la-mondiale","target":"non-WT-team","rider":"latour pierre","value":63,"team_name_2020":"AG2R La Mondiale","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ag2r-la-mondiale","target":"non-WT-team","rider":"raugel antoine","value":10,"team_name_2020":"AG2R La Mondiale","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ag2r-la-mondiale","target":"non-WT-team","rider":"vuillermoz alexis","value":54,"team_name_2020":"AG2R La Mondiale","team_name_2021":"non-World Tour team ('21)"},
         {"source":"lotto-soudal-20","target":"ag2r-citroen-team","rider":"dewulf stan","value":156,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"AG2R Citroën Team"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"cras steff","value":29,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"de buyst jasper","value":95,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"de gendt thomas","value":121,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"degenkolb john","value":589,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"ewan caleb","value":971,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"frison frederik","value":70,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"gilbert philippe","value":238,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"goossens kobe","value":42,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"holmes matthew","value":112,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"kluge roger","value":67,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"marczyński tomasz","value":45,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"oldani stefano","value":53,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"thijssen gerben","value":132,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"van der sande tosh","value":10,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"van moer brent","value":15,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"vanhoucke harm","value":110,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"vermeersch florian","value":270,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"lotto-soudal","rider":"wellens tim","value":521,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"lotto-soudal-20","target":"cofidis-solutions-credits","rider":"wallays jelle","value":38,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"lotto-soudal-20","target":"team-qhubeka-assos","rider":"armée sander","value":121,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"lotto-soudal-20","target":"israel-start-up-nation","rider":"hagen carl fredrik","value":111,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"lotto-soudal-20","target":"retired","rider":"dibben jonathan","value":5,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"lotto-soudal-20","target":"retired","rider":"hansen adam","value":10,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"lotto-soudal-20","target":"unsigned","rider":"iversen rasmus","value":3,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"lotto-soudal-20","target":"retired","rider":"maes nikolas","value":36,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"lotto-soudal-20","target":"unsigned","rider":"van goethem brian","value":7,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"lotto-soudal-20","target":"non-WT-team","rider":"mertz rémy","value":18,"team_name_2020":"Lotto Soudal ('20)","team_name_2021":"non-World Tour team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"alba juan diego","value":3,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"arcas jorge","value":30,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"carretero héctor","value":47,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"cataldo dario","value":30,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"cullaigh gabriel","value":10,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"elosegui iñigo","value":5,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"erviti imanol","value":24,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"hollmann juri","value":11,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"jacobs johan","value":121,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"jorgenson matteo","value":68,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"mas lluís","value":29,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"mas enric","value":926,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"mora sebastián","value":10,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"norsgaard mathias","value":10,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"oliveira nelson","value":178,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"pedrero antonio","value":59,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"rojas josé joaquín","value":41,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"rubio einer augusto","value":24,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"samitier sergio","value":93,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"soler marc","value":437,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"torres albert","value":10,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"valverde alejandro","value":716,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"verona carlos","value":124,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"movistar-team","rider":"villella davide","value":126,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"movistar-team-20","target":"unsigned","rider":"betancur carlos","value":10,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"movistar-team-20","target":"retired","rider":"roelandts jürgen","value":125,"team_name_2020":"Movistar Team ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"movistar-team-20","target":"non-WT-team","rider":"prades eduard","value":107,"team_name_2020":"Movistar Team ('20)","team_name_2021":"non-World Tour team ('21)"},
         {"source":"movistar-team-20","target":"non-WT-team","rider":"sepúlveda eduardo","value":23,"team_name_2020":"Movistar Team ('20)","team_name_2021":"non-World Tour team ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"ag2r-citroen-team","rider":"prodhomme nicolas","value":3,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"AG2R Citroën Team"},
         {"source":"cofidis-solutions-credits-20","target":"ag2r-citroen-team","rider":"touzé damien","value":85,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"AG2R Citroën Team"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"allegaert piet","value":108,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"barceló fernando","value":53,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"berhane natnael","value":5,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"consonni simone","value":86,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"edet nicolas","value":190,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"finé eddy","value":3,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"haas nathan","value":151,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"herrada jesús","value":349,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"herrada josé","value":40,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"lafay victor","value":7,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"laporte christophe","value":83,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"martin guillaume","value":1262,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"morin emmanuel","value":119,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"perez anthony","value":38,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"périchon pierre-luc","value":10,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"sabatini fabio","value":3,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"vanbilsen kenneth","value":10,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"viviani elia","value":254,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"cofidis-solutions-credits","rider":"viviani attilio","value":20,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"team-qhubeka-assos","rider":"claeys dimitri","value":200,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"cofidis-solutions-credits-20","target":"retired","rider":"hansen jesper","value":87,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"cofidis-solutions-credits-20","target":"unsigned","rider":"le turnier mathias","value":3,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"cofidis-solutions-credits-20","target":"unsigned","rider":"mathis marco","value":10,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"cofidis-solutions-credits-20","target":"unsigned","rider":"rossetto stéphane","value":13,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"cofidis-solutions-credits-20","target":"unsigned","rider":"vermote julien","value":47,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"Retired/unsigned"},
         {"source":"cofidis-solutions-credits-20","target":"non-WT-team","rider":"lemoine cyril","value":42,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"non-World Tour team ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"non-WT-team","rider":"maté luis ángel","value":40,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"non-World Tour team ('21)"},
         {"source":"cofidis-solutions-credits-20","target":"non-WT-team","rider":"zanoncello enrico","value":3,"team_name_2020":"Cofidis, Solutions Crédits ('20)","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ntt-pro-cycling","target":"uae-team-emirates","rider":"gibbons ryan","value":138,"team_name_2020":"NTT Pro Cycling","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"ntt-pro-cycling","target":"astana-premier-tech","rider":"battistella samuele","value":71,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Astana - Premier Tech"},
         {"source":"ntt-pro-cycling","target":"astana-premier-tech","rider":"de bod stefan","value":43,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Astana - Premier Tech"},
         {"source":"ntt-pro-cycling","target":"astana-premier-tech","rider":"sobrero matteo","value":20,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Astana - Premier Tech"},
         {"source":"ntt-pro-cycling","target":"trek-segafredo","rider":"ghebreigzabhier amanuel","value":55,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"ntt-pro-cycling","target":"ef-education-nippo","rider":"valgren michael","value":181,"team_name_2020":"NTT Pro Cycling","team_name_2021":"EF Education - Nippo"},
         {"source":"ntt-pro-cycling","target":"bahrain-victorious","rider":"mäder gino","value":101,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Bahrain - Victorious"},
         {"source":"ntt-pro-cycling","target":"ag2r-citroen-team","rider":"o'connor ben","value":197,"team_name_2020":"NTT Pro Cycling","team_name_2021":"AG2R Citroën Team"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"barbero carlos","value":126,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"campenaerts victor","value":258.3,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"dlamini nic","value":10,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"gogl michael","value":142,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"janse van rensburg reinardt","value":87,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"nizzolo giacomo","value":1115,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"pozzovivo domenico","value":170,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"stokbro andreas","value":10,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"sunderland dylan","value":6,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"team-qhubeka-assos","rider":"walscheid max","value":148,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"ntt-pro-cycling","target":"intermarche-wanty-gobert","rider":"meintjes louis","value":143,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"ntt-pro-cycling","target":"retired","rider":"carbel michael","value":10,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Retired/unsigned"},
         {"source":"ntt-pro-cycling","target":"unsigned","rider":"dyball benjamin","value":10,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Retired/unsigned"},
         {"source":"ntt-pro-cycling","target":"retired","rider":"gasparotto enrico","value":48,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Retired/unsigned"},
         {"source":"ntt-pro-cycling","target":"unsigned","rider":"iribe shotaro","value":10,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Retired/unsigned"},
         {"source":"ntt-pro-cycling","target":"retired","rider":"thomson jay robert","value":10,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Retired/unsigned"},
         {"source":"ntt-pro-cycling","target":"unsigned","rider":"wyss danilo","value":91,"team_name_2020":"NTT Pro Cycling","team_name_2021":"Retired/unsigned"},
         {"source":"ntt-pro-cycling","target":"non-WT-team","rider":"boasson hagen edvald","value":108,"team_name_2020":"NTT Pro Cycling","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ntt-pro-cycling","target":"non-WT-team","rider":"king ben","value":54,"team_name_2020":"NTT Pro Cycling","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ntt-pro-cycling","target":"non-WT-team","rider":"kreuziger roman","value":45,"team_name_2020":"NTT Pro Cycling","team_name_2021":"non-World Tour team ('21)"},
         {"source":"ntt-pro-cycling","target":"non-WT-team","rider":"tiller rasmus","value":10,"team_name_2020":"NTT Pro Cycling","team_name_2021":"non-World Tour team ('21)"},
         {"source":"israel-start-up-nation-20","target":"bora-hansgrohe","rider":"politt nils","value":67,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"israel-start-up-nation-20","target":"groupama-fdj","rider":"badilatti matteo","value":178,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"barbier rudy","value":115,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"biermans jenthe","value":55,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"boivin guillaume","value":36,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"brändle matthias","value":67,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"cataford alexander","value":13,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"cimolai davide","value":24,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"dowsett alex","value":197,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"einhorn itamar","value":86,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"goldstein omer","value":58,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"greipel andré","value":15,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"hermans ben","value":170,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"hofstetter hugo","value":265,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"hollenstein reto","value":3,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"martin dan","value":1058,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"neilands krists","value":40,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"niv guy","value":15,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"piccoli james","value":61,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"renard alexis","value":5,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"sagiv guy","value":45,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"vahtra norman","value":110,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"van asbroeck tom","value":92,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"würtz schmidt mads","value":91,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"israel-start-up-nation","rider":"zabel rick","value":43,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"israel-start-up-nation-20","target":"retired","rider":"mccabe travis","value":10,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Retired/unsigned"},
         {"source":"israel-start-up-nation-20","target":"unsigned","rider":"navarro daniel","value":82,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Retired/unsigned"},
         {"source":"israel-start-up-nation-20","target":"unsigned","rider":"räim mihkel","value":50,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Retired/unsigned"},
         {"source":"israel-start-up-nation-20","target":"unsigned","rider":"schelling patrick","value":23,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Retired/unsigned"},
         {"source":"israel-start-up-nation-20","target":"retired","rider":"sutherland rory","value":10,"team_name_2020":"Israel Start-Up Nation","team_name_2021":"Retired/unsigned"},
         {"source":"neo-pro","target":"team-jumbo-visma","rider":"kooij olav","value":304,"team_name_2020":"NeoPro","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"neo-pro","target":"team-jumbo-visma","rider":"leemreize gijs","value":18.1,"team_name_2020":"NeoPro","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"neo-pro","target":"team-dsm","rider":"brenner marco","value":10,"team_name_2020":"NeoPro","team_name_2021":"Team DSM"},
         {"source":"neo-pro","target":"bora-hansgrohe","rider":"palzer anton","value":10,"team_name_2020":"NeoPro","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"neo-pro","target":"bora-hansgrohe","rider":"walls matthew","value":10,"team_name_2020":"NeoPro","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"neo-pro","target":"bora-hansgrohe","rider":"zwiehoff ben","value":10,"team_name_2020":"NeoPro","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"neo-pro","target":"astana-premier-tech","rider":"romo javier","value":50,"team_name_2020":"NeoPro","team_name_2021":"Astana - Premier Tech"},
         {"source":"neo-pro","target":"lotto-soudal","rider":"grignard sébastien","value":3,"team_name_2020":"NeoPro","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"neo-pro","target":"lotto-soudal","rider":"sweeny harry","value":33,"team_name_2020":"NeoPro","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"neo-pro","target":"lotto-soudal","rider":"van gils maxim","value":52,"team_name_2020":"NeoPro","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"neo-pro","target":"lotto-soudal","rider":"verschaeve viktor","value":7,"team_name_2020":"NeoPro","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"neo-pro","target":"lotto-soudal","rider":"vervloesem xandres","value":30,"team_name_2020":"NeoPro","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"neo-pro","target":"movistar-team","rider":"gonzález abner","value":10,"team_name_2020":"NeoPro","team_name_2021":"Movistar Team ('21)"},
         {"source":"neo-pro","target":"cofidis-solutions-credits","rider":"champion thomas","value":26,"team_name_2020":"NeoPro","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"neo-pro","target":"cofidis-solutions-credits","rider":"toumire hugo","value":10,"team_name_2020":"NeoPro","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"non-WT-team-20","target":"team-jumbo-visma","rider":"dekker david","value":148,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team Jumbo-Visma ('21)"},
         {"source":"non-WT-team-20","target":"uae-team-emirates","rider":"ayuso juan","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"UAE-Team Emirates ('21)"},
         {"source":"non-WT-team-20","target":"team-dsm","rider":"combaud romain","value":73,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team DSM"},
         {"source":"non-WT-team-20","target":"team-dsm","rider":"leknessund andreas","value":346.3,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team DSM"},
         {"source":"non-WT-team-20","target":"team-dsm","rider":"märkl niklas","value":28,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team DSM"},
         {"source":"non-WT-team-20","target":"team-ineos","rider":"pidcock thomas","value":75,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team INEOS"},
         {"source":"non-WT-team-20","target":"bora-hansgrohe","rider":"aleotti giovanni","value":75,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"non-WT-team-20","target":"bora-hansgrohe","rider":"meeus jordi","value":279,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"non-WT-team-20","target":"bora-hansgrohe","rider":"wandahl frederik","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"BORA - hansgrohe ('21)"},
         {"source":"non-WT-team-20","target":"astana-premier-tech","rider":"brussenskiy gleb","value":31,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Astana - Premier Tech"},
         {"source":"non-WT-team-20","target":"astana-premier-tech","rider":"fedorov yevgeniy","value":221,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Astana - Premier Tech"},
         {"source":"non-WT-team-20","target":"astana-premier-tech","rider":"perry ben","value":3,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Astana - Premier Tech"},
         {"source":"non-WT-team-20","target":"astana-premier-tech","rider":"piccolo andrea","value":20,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Astana - Premier Tech"},
         {"source":"non-WT-team-20","target":"trek-segafredo","rider":"egholm jakob","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Trek - Segafredo ('21)"},
         {"source":"non-WT-team-20","target":"greenedge-cycling","rider":"colleoni kevin","value":69,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"GreenEDGE Cycling"},
         {"source":"non-WT-team-20","target":"ef-education-nippo","rider":"arroyave daniel","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"EF Education - Nippo"},
         {"source":"non-WT-team-20","target":"ef-education-nippo","rider":"beppu fumiyuki","value":5,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"EF Education - Nippo"},
         {"source":"non-WT-team-20","target":"ef-education-nippo","rider":"camargo diego andres","value":20,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"EF Education - Nippo"},
         {"source":"non-WT-team-20","target":"ef-education-nippo","rider":"nakane hideto","value":147,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"EF Education - Nippo"},
         {"source":"non-WT-team-20","target":"groupama-fdj","rider":"van den berg lars","value":9,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Groupama - FDJ ('21)"},
         {"source":"non-WT-team-20","target":"bahrain-victorious","rider":"milan jonathan","value":40,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Bahrain - Victorious"},
         {"source":"non-WT-team-20","target":"ag2r-citroen-team","rider":"calmejane lilian","value":136,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"AG2R Citroën Team"},
         {"source":"non-WT-team-20","target":"lotto-soudal","rider":"conca filippo","value":45,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"non-WT-team-20","target":"lotto-soudal","rider":"kron andreas","value":255,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"non-WT-team-20","target":"lotto-soudal","rider":"moniquet sylvain","value":22,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Lotto Soudal ('21)"},
         {"source":"non-WT-team-20","target":"movistar-team","rider":"serrano gonzalo","value":138,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Movistar Team ('21)"},
         {"source":"non-WT-team-20","target":"cofidis-solutions-credits","rider":"carvalho andre","value":23,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"non-WT-team-20","target":"cofidis-solutions-credits","rider":"fernández rubén","value":203,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"non-WT-team-20","target":"cofidis-solutions-credits","rider":"rochas rémy","value":83,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Cofidis, Solutions Crédits ('21)"},
         {"source":"non-WT-team-20","target":"team-qhubeka-assos","rider":"brown connor","value":18,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"non-WT-team-20","target":"team-qhubeka-assos","rider":"hansen lasse norman","value":13,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"non-WT-team-20","target":"team-qhubeka-assos","rider":"pelucchi matteo","value":15,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"non-WT-team-20","target":"team-qhubeka-assos","rider":"schmid mauro","value":42.3,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"non-WT-team-20","target":"team-qhubeka-assos","rider":"vacek karel","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"non-WT-team-20","target":"team-qhubeka-assos","rider":"vinjebo emil","value":21,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Team Qhubeka ASSOS"},
         {"source":"non-WT-team-20","target":"israel-start-up-nation","rider":"berwick sebastian","value":123,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"non-WT-team-20","target":"israel-start-up-nation","rider":"jones taj","value":30,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Israel Start-Up Nation ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"bakelants jan","value":217,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"bellicaud jeremy","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"de gendt aimé","value":518,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"de plus jasper","value":9.3,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"de winter ludwig","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"delacroix theo","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"devriendt tom","value":73,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"eiking odd christian","value":26,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"evans alexander","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"hermans quinten","value":3,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"kreder wesley","value":5,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"lammertink maurits","value":173,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"pasqualon andrea","value":500,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"petilli simone","value":70,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"planckaert baptiste","value":108,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"rota lorenzo","value":266,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"taaramäe rein","value":8,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"van kessel corné","value":20,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"van melsen kévin","value":10,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"van poppel danny","value":429,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"van poppel boy","value":4,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"vanspeybrouck pieter","value":13,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"},
         {"source":"non-WT-team-20","target":"intermarche-wanty-gobert","rider":"vliegen loïc","value":296,"team_name_2020":"non-World Tour team ('20)","team_name_2021":"Intermarché Wanty Gobert ('21)"}        
        ]
      }

    const svg = d3.select("#canvas")
                  .attr("viewBox", `0 0 ${width} ${height}`)
                  .append("g")
                  .attr("transform", `translate( ${width/2 + margin_x/2},${margin_y})`);
    
    // Define our sankey instance.
    const graphSize = [width/2.7, height ];
    const sankey = d3.sankey()
                     .size(graphSize)
                     .nodeId(d => d.id)
                     .nodeWidth(nodeWidth)
                     .nodePadding(nodePadding)
                     .nodeAlign(nodeAlignment)
                     .nodeSort(function(a, b) { return a.height - b.height; });
    let graph = sankey(data);
    
    // Loop through the nodes. Set additional properties to make a few things
    // easier to deal with later.
    graph.nodes.forEach(node => {
        let fillColor = color(node.index);
        node.fillColor = fillColor;
        node.strokeColor = darkenColor(fillColor, nodeDarkenFactor);
        node.width = node.x1 - node.x0;
        node.height = node.y1 - node.y0;
    });
    
    
    let svgNodeswide = svg.append("g")
                      .classed("nodes", true)
                      .selectAll("g")
                      .data(graph.nodes)
                      .enter()
                      .append("g")

    svgNodeswide.append("rect")
                      .classed("logo", true)
                      .attr("x", d => d.x0-25)
                      .attr("y", d => d.y0)
                      .attr("width", d => d.width*margin_x/2)
                      .attr("height", d => d.height)
                      .filter(function(d) { return d.x0 < width ; })
                      .attr("fill", d => "white")
                      .attr("opacity", 0)
                      .attr("stroke", "black")
                      .attr("stroke-width", 0)
                      .on("mouseover", logoAnimate)
                      .on("mouseout", logoClear);

        svgNodeswide.append('svg:image')
                      .classed("logo", true)
                      .attr("x", d => d.x0-25)
                      .attr("y", d => d.y0)
                      .attr("width", d => d.width*margin_x/2)
                      .attr("height", d => d.height)
                      .filter(function(d) { return d.x0 < width / 4; })
                      .attr('href', function(d,i){return "imgs/" + d.id + '.png';}) 
                      .attr("opacity", 0.9)
                      .attr("stroke", "black")
                      .attr("stroke-width", 0)
                      .on("mouseover", logoAnimate)
                      .on("mouseout", logoClear);


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
                      .on("mouseover", branchAnimate)
                      .on("mouseout", branchClear);

        // Build the links.
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