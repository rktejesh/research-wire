// Load Bootstrap JS
import bootstrap from 'bootstrap'
import $ from 'jquery'
import Chart from 'chart.js/auto';

// Load Styles
import '../scss/main.scss';
import { hide } from '@popperjs/core';

// App code

$(function(){
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
}

var ctx = document.getElementById('myChart').getContext('2d');
let delayed;
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19'],
    datasets: [{
      label: 'Employees',
      data: [4, 7, 12, 25, 35, 50, 60, 70, 120],
      backgroundColor: "#003366",
    }, {
      label: 'Revenue',
      data: [2, 29, 5, 5, 2, 3, 10],
      backgroundColor: "#336699 ",
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
  
  window.onload = function () {
    particles.init({
      selector: ".reward-background"
    });
  };
  var particles = Particles.init({
    selector: ".reward-background",
    color: ["#03dac6", "#ff0266", "#000000"],
    connectParticles: true,
    responsive: [
      {
        breakpoint: 768,
        options: {
          color: ["#faebd7", "#03dac6", "#ff0266"],
          maxParticles: 43,
          connectParticles: false
        }
      }
    ]
  });
  

  //Trees
