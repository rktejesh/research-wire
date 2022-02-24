// Load Bootstrap JS
import bootstrap from 'bootstrap'
import $, { data } from 'jquery'
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Datamap from 'datamaps'
require('waypoints/lib/noframework.waypoints.min')

Chart.register(ChartDataLabels);

// Load Styles
import '../scss/main.scss';
import { hide } from '@popperjs/core';

$(function(){
  updateChartType();
    Parallax();
	$(window).on("scroll", function() {
		Parallax();
	});
});

function Parallax() {
	var scrollPos = $(document).scrollTop();
	$('#banner').css({
		'background-position' : '100% ' + (-scrollPos/4)+"px"
	});
	$('#bannertext').css({
		'margin-top': (scrollPos/4)+"px",
		'opacity': 1-(scrollPos/250)
	});
  if(document.getElementById('bannertext').style.opacity < 0) {
    document.getElementById('bannertext').style.display = "none";
  } else {
    document.getElementById('bannertext').style.display = "block";
  }
}

var dataObjects = [
  {
    labels: ['12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21'],
    datasets: [{
      label: 'Employees',
      data: [4, 7, 12, 25, 35, 50, 60, 70, 120],
      backgroundColor: ["#55b5cd", "#370665", "#35589A", "#F14A16", "#FC9918", "#3FA796", "#9B0000", "#F9C5D5", "#04293A"],
    }]
  },
  {
    labels: ['12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19'],
    datasets: [{
      label: 'Revenue',
    data: [5, 7, 13, 27, 35, 50, 60, 70],
      backgroundColor: ["#55b5cd", "#370665", "#35589A", "#F14A16", "#FC9918", "#3FA796", "#9B0000", "#F9C5D5", "#04293A"],
    }]
  }
]

var ctx = document.getElementById('myChart').getContext('2d');
let delayed;
var myChart = new Chart(ctx, {
  type: 'bar',
  data: dataObjects[0],
  options: {
    elements: {
      center: false
    },
    responsive: true,
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayed) {
          delay = 1000;
        }
        return delay;
      },
    },
  }
});

function updateChartType() {
  // Destroy the previous chart
  myChart.destroy();
  // Draw a new chart on the basic of dropdown
  myChart = new Chart(ctx, {
  type: 'bar',  // Select chart type from dropdown
  data: dataObjects[document.getElementById("chartType").value],
  options: {
    elements: {
      center: false
    },
    responsive: true,
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayed) {
          delay = 1000;
        }
        return delay;
      },
    },
    scales: {
      x: {
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        grid: {
          drawOnChartArea: false,
        },
      }
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#000',
        font: {
          weight: 'bold',
          size: 15
        },
      },
      legend: {
        display: false
      }
    }
  }
  });
};

document.getElementById('chartType').onchange = function () {
  updateChartType();
};

Chart.register({
  id: 'centertext',
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
        // Get ctx from string
        var ctx = chart.ctx;
        // Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var maxFontSize = centerConfig.maxFontSize || 75;
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding / 100) * (chart._metasets[chart._metasets.length-1].data[0].innerRadius * 2)
        // Start with a base font of 30px
        ctx.font = "30px " + fontStyle;

        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart._metasets[chart._metasets.length-1].data[0].innerRadius * 2) - sidePaddingCalculated;            

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart._metasets[chart._metasets.length-1].data[0].innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
        var minFontSize = centerConfig.minFontSize;
        var lineHeight = centerConfig.lineHeight || 5;
        var wrapText = false;

        if (minFontSize === undefined) {
            minFontSize = 10;
        }

        if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = minFontSize;
            wrapText = true;
        }

        // Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = fontSizeToUse + "px " + fontStyle;
        ctx.fillStyle = color;

        if (!wrapText) {
            ctx.fillText(txt, centerX, centerY);
            return;
        }

        var words = txt.split(' ');
        var line = '';
        var lines = [];

        // Break words up into multiple lines if necessary
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > elementWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }

        // Move the center up depending on line height and number of lines
        centerY -= (lines.length / 2) * lineHeight;

        for (var n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
        }
        //Draw text in center
        ctx.fillText(line, centerX, centerY);
    }
}
});

var chartTextList = [
  'Peformance evaluation increased by 94%',
  'Careers plans and progress increased by 86%',
  'Compensation evaluation increased by 89%'
]

var countChart = 0;

setInterval(function(){ 
  workforceChart.options.elements.center.text = chartTextList[countChart%3];
  workforceChart.update();
  countChart++;
}, 2000);

var ctx1 = document.getElementById('workforce-chart').getContext('2d');
var workforceChart = new Chart(ctx1, {
  type: 'doughnut',
  data: {
    labels: ['Peformance Evaluations', 'Career plans and progress', 'Compensation'],
    datasets: [{
      label: 'Employee Workforce',
      data: [94, 86, 89],
      backgroundColor: ["#000080", "#6495ed", "#40e0d0"],
    }]
  },
  options: {
    responsive: true,
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayed) {
          delay = 1000;
        }
        return delay;
      },
    },
    scales: {
      x: {
        grid: {
          drawOnChartArea: false,
          display: false,
          drawBorder: false,
          drawTicks: false,
        },
        ticks: {
          display: false
        }
      },
      y: {
        grid: {
          drawOnChartArea: false,
          display: false,
          drawBorder: false,
          drawTicks: false,
        },
        ticks: {
          display: false
        }
      }
    },
    plugins: {
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 15
        },
        formatter: function(value, context) {
          return Math.round(value) + '%';
        }
      },
      legend: {
        display: false
      }
    },
    elements: {
      center: {
        text: '',
        color: '#008080', // Default is #000000
        wrapText: true,
        sidePadding: 10, // Default is 20 (as a percentage)
        maxFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
        minFontSize: 15,
        lineHeight: 25 // Default is 25 (in px), used for when text wraps
      }
    }
  }
});


const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".navbar ul li a");
/* const el = document.getElementById('navbar');

el.addEventListener('mouseover', function handleMouseOver() {
  $('.navbar ul li a p').css('display','block');
});

// ✅ (optionally) Hide element on mouse out
el.addEventListener('mouseout', function handleMouseOut() {
  $('.navbar ul li a p').css('display','none');
}); */

document.querySelector('.navbar').addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') {
        document.querySelectorAll('.navbar a')
        .forEach(e => e.classList.remove('active'));
        e.target.classList.add('active');
    }
  });

window.onscroll = () => {
   var current = "";  
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop ) {
        current = section.getAttribute("id"); 
    }
    });
  
    navLi.forEach((a) => {
      a.classList.remove("active");
      if (a.classList.contains(current)) {
        a.classList.add("active");
      }
    });
  };
  
  particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#3f3f3f"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#3f3f3f"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 2,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#545454",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 150,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
  
var mapData = {
  element: document.getElementById('map'),
  scope: 'world',
  responsive: true,
  projection: 'mercator',
  geographyConfig: {
    popupTemplate: function(geography, data) { //this function should just return a string
      return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
    },
      highlightBorderColor: '#fff',
      highlightBorderWidth: 1,
      highlightFillColor: '#1e002a',
      popupOnHover: true
  },
  
  fills: {
      defaultFill: '#dee2e6',
      gt: '#112d4e'
  },
  data: {
      USA: { fillKey: 'gt' },
      CAN: { fillKey: 'gt' },
      FRA: { fillKey: 'gt' },
      DEU: { fillKey: 'gt' },
      DNK: { fillKey: 'gt' },
      NOR: { fillKey: 'gt' },
      CHN: { fillKey: 'gt' },
      JPN: { fillKey: 'gt' },
      TWN: { fillKey: 'gt' },
      PRK: { fillKey: 'gt' },
      KOR: { fillKey: 'gt' },
  },
  }

var dataMap = new Datamap(mapData);

$(window).on('resize', function() {
  document.getElementById('map').innerHTML = "";
  var dataMap = new Datamap(mapData);
})

// Function for all svg animations
$(function() {
  //variable for the 'stroke-dashoffset' unit
  var $dashOffset = $(".path1").css("stroke-dashoffset");
  //on a scroll event - execute function
  $(window).on('scroll',function() {
    //calculate how far down the page the user is 
    var $percentageComplete = (($(window).scrollTop() / ($("html").height() - $(window).height())) * 100) + 20;
    //convert dashoffset pixel value to interger
    var $newUnit = parseInt($dashOffset, 10);
    //get the value to be subtracted from the 'stroke-dashoffset'
    var $offsetUnit = $percentageComplete * ($newUnit / 100);
    //set the new value of the dashoffset to create the drawing effect
    $(".path1").css("stroke-dashoffset", $newUnit - $offsetUnit);
});
});

$(function() {
  //variable for the 'stroke-dashoffset' unit
  var $dashOffset = $(".path").css("stroke-dashoffset");
  //on a scroll event - execute function
  $(window).on('scroll', function() {
    //calculate how far down the page the user is 
    var elDistanceToTop = document.querySelector('.path').getBoundingClientRect().top;
    var elDistanceFromTop = window.innerHeight - elDistanceToTop - document.querySelector('.path').getBoundingClientRect().height/2;
    var scrollPercentage = elDistanceFromTop / window.innerHeight;
    var $percentageComplete = scrollPercentage * 50;
    //convert dashoffset pixel value to interger
    var $newUnit = parseInt($dashOffset, 10);
    //get the value to be subtracted from the 'stroke-dashoffset'
    var $offsetUnit = $percentageComplete * ($newUnit / 100);
    //set the new value of the dashoffset to create the drawing effect
    $(".path").css("stroke-dashoffset", $newUnit - $offsetUnit);
  });
});


var path2 = document.querySelector('.path2');

// Get length of path... ~577px in this case
var pathLength2 = path2.getTotalLength();

// Make very long dashes (the length of the path itself)
path2.style.strokeDasharray = pathLength2 + ' ' + pathLength2;

// Offset the dashes so the it appears hidden entirely
path2.style.strokeDashoffset = pathLength2;

// Jake Archibald says so
// https://jakearchibald.com/2013/animated-line-drawing-svg/
path2.getBoundingClientRect();

// When the page scrolls...
window.addEventListener("scroll", function(e) {
 
  // What % down is it? 
  // https://stackoverflow.com/questions/2387136/cross-browser-method-to-determine-vertical-scroll-percentage-in-javascript/2387222#2387222
  // Had to try three or four differnet methods here. Kind of a cross-browser nightmare.
  var elDistanceToTop2 = path2.getBoundingClientRect().top
  var elDistanceFromTop2 = elDistanceToTop2 - window.innerHeight
  var scrollPercentage2 = elDistanceFromTop2 / window.innerHeight

  //var scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
  //console.log(elDistanceToTop - window.innerHeight);
  
  //console.log(window.scrollY);
  // Length to offset the dashes
  var drawLength2 = pathLength2 * scrollPercentage2;
  
  // Draw in reverse
  path2.style.strokeDashoffset = pathLength2 + drawLength2;
    
  // When complete, remove the dash array, otherwise shape isn't quite sharp
 // Accounts for fuzzy math
  if (scrollPercentage2 >= 0.99) {
    path2.style.strokeDasharray = "none";
    
  } else {
    path2.style.strokeDasharray = pathLength2 + ' ' + pathLength2;
  }
  
});

$(function() {
  //variable for the 'stroke-dashoffset' unit
  var $dashOffset = $(".path3").css("stroke-dashoffset");
  //on a scroll event - execute function
  $(window).on('scroll', function() {
    //calculate how far down the page the user is 
    var elDistanceToTop = document.querySelector('.path3').getBoundingClientRect().top;
    var elDistanceFromTop = window.innerHeight - elDistanceToTop - 1.5*document.querySelector('.path3').getBoundingClientRect().height;
    var scrollPercentage = elDistanceFromTop / window.innerHeight;
    var $percentageComplete = scrollPercentage * 50;
    //convert dashoffset pixel value to interger
    var $newUnit = parseInt($dashOffset, 10);
    //get the value to be subtracted from the 'stroke-dashoffset'
    var $offsetUnit = $percentageComplete * ($newUnit / 100);
    //set the new value of the dashoffset to create the drawing effect
    $(".path3").css("stroke-dashoffset", $newUnit - $offsetUnit);
  });
});

$(function(){
	var inputs = $('.input');
	var paras = $('.description-flex-container').find('p');
	inputs.on('click',function(){
		var t = $(this),
				ind = t.index(),
				matchedParas = paras.eq(ind);
		t.add(matchedParas).addClass('active');
		inputs.not(t).add(paras.not(matchedParas)).removeClass('active');
	});
});


const initAnimatedCounts = () => {
  const ease = (n) => {
    // https://github.com/component/ease/blob/master/index.js
    return --n * n * n + 1;
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Once this element is in view and starts animating, remove the observer,
        // because it should only animate once per page load.
        observer.unobserve(entry.target);
        const countToString = entry.target.getAttribute('data-countTo');
        const countTo = parseFloat(countToString);
        const duration = parseFloat(entry.target.getAttribute('data-animateDuration'));
        const countToParts = countToString.split('.');
        const precision = countToParts.length === 2 ? countToParts[1].length : 0;
        const startTime = performance.now();
        const step = (currentTime) => {
          const progress = Math.min(ease((currentTime  - startTime) / duration), 1);
          entry.target.textContent = (progress * countTo).toFixed(precision);
          if (progress < 1) {
            animationFrame = window.requestAnimationFrame(step);
          } else {
            window.cancelAnimationFrame(animationFrame);
          }
        };
        let animationFrame = window.requestAnimationFrame(step);
      }
    });
  });
  document.querySelectorAll('[data-animateDuration]').forEach((target) => {
    target.setAttribute('data-countTo', target.textContent);
    target.textContent = '0';
    observer.observe(target);
  });
};
initAnimatedCounts();

var imggridnum = 0;

var imgGridList = [
  "url('/dist/images/Team/IMG_8883.jpg')",
  "url('/dist/images/Team/DSC_1103.JPG')",
  "url('/dist/images/Team/DSC_1158.JPG')",
  "url('/dist/images/Team/IMG_8834.jpg')",
  "url('/dist/images/Team/IMG_8847.jpg')",
  "url('/dist/images/Team/IMG_8867.jpg')",
  "url('/dist/images/Team/IMG_8877.jpg')",
  "url('/dist/images/Team/IMG_8883.jpg')",
  "url('/dist/images/Team/IMG_8924.jpg')",
]

setInterval(function() {
    var childList = document.querySelectorAll('.img-grid-child');
      childList.forEach(function(child) {
        child.classList.add("visible");
      });
    document.getElementById("img-grid").style.backgroundImage=imgGridList[imggridnum%imgGridList.length];
    imggridnum++;
}, 1500);

var footerTextList = [
  "<q>Diversity <br>The beauty of humanity</q>",
  "<q>Equality <br>When there is hope there is power</q>",
  "<q>Inclusion <br>In Unity there is strength</q>"
]

var footerTextNum = 0;
setInterval(function() {
  document.getElementById("footer-text").innerHTML = footerTextList[footerTextNum%footerTextList.length];
  footerTextNum++;
}, 2000)

/* window.addEventListener("scroll", function() {
  var elem = document.getElementById('img-grid');
  var vwTop = window.pageYOffset;
  var vwBottom = (window.pageYOffset + window.innerHeight);
  var elemTop = elem.offsetTop;
  var elemHeight = elem.offsetHeight;
  if (vwBottom > elemTop && ((vwTop - elemHeight) < elemTop)) {
    var childList = document.querySelectorAll('.img-grid-child');
    childList.forEach(function(child) {
      child.classList.add("visible");
    })
  }
}, false); */