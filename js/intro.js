var intro = introJs();
intro.setOptions({
  tooltipClass: "intro_tour",
  highlightClass: "intro_high",
  overlayOpacity: 0.55,
  showStepNumbers: false,
  skipLabel: "Quit",
  doneLabel: "Loading...",
  prevLabel: "≪",
  nextLabel: "≫",
  scrollToElement: false,
  tooltipPosition: 'top',
  exitOnOverlayClick: true,
  showBullets: false,
  steps: [
    {
      intro: `<table style="width:100%;margin:0.8rem 0 1.6rem 0;"><tr><td id="intro-logo"><img src="lib/UC_UI_Horizontal.svg"></img></td>
              <td style="width:100%;"><h2 style="text-align:left;font-size:1.8rem;color: #04487C;">Direct and indirect impacts of sea-level rise on USA communities</h2></td></tr></table>
              <p>To effectively prepare and adapt our communities to climate change, we must enhance our understanding of the possible impacts that may come with rising sea levels. We believe current assessments underestimate the population at risk of displacement from sea level rise by limiting calculations to the number of people directly exposed.<br><br>
              Use this web-app to compare the use of direct impacts (exposure) and indirect impacts (isolation and disrupted access) when assessing the sea-level rise scenarios provided by <a href="https://coast.noaa.gov/slr/">NOAA</a>.
              `
    },
]});

intro.start();

