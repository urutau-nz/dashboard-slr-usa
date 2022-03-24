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
  exitOnOverlayClick: false,
  showBullets: false,
  steps: [
    {
      intro: `<table style="width:100%;margin:0.8rem 0 1.6rem 0;"><tr><td id="intro-logo"><img src="lib/UC_UM_Horizontal-220px.png"></img></td>
              <td style="width:100%;"><h2 style="text-align:left;font-size:1.8rem;color: #04487C;">Direct and indirect impacts of sea-level rise on USA communities</h2></td></tr></table>
              <p style="text-align:justify">Targeted, effective, and timely climate change adaptation planning relies on estimates of how many people may be forced from their homes by sea-level rise and when this displacement will start to occur. The typical displacement metric used is parcel inundation. However, this metric does not capture cascading impacts once non-residential assets are inundated. Our research explores the use of risk of isolation - meaning a disconnection of a resident to public accommodations and amenities.<br><br>
              Use this web-app to compare the risk of inundation and risk of isolation and explore where and when these risks may occur under different <a href="https://coast.noaa.gov/slr/" target="_blank">NOAA</a> sea-level rise scenarios.
              `
    },
]});

intro.start();

