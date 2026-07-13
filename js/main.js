document.addEventListener("DOMContentLoaded", function () {
  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Render upcoming shows from js/shows.js, hiding past dates
  var list = document.getElementById("shows-list");
  var empty = document.getElementById("shows-empty");
  if (list && typeof SHOWS !== "undefined") {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var upcoming = SHOWS.filter(function (s) {
      return new Date(s.date + "T23:59:59") >= today;
    }).sort(function (a, b) {
      return a.date < b.date ? -1 : 1;
    });

    if (upcoming.length === 0) {
      if (empty) empty.hidden = false;
    } else {
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      upcoming.forEach(function (s) {
        var d = new Date(s.date + "T12:00:00");
        var li = document.createElement("li");
        li.className = "show";

        var cta = s.soldOut
          ? '<span class="show__soldout">Sold out</span>'
          : s.tickets
            ? '<a class="show__tickets" href="' + s.tickets + '" target="_blank" rel="noopener">Tickets</a>'
            : "";

        li.innerHTML =
          '<div class="show__date">' +
            '<span class="show__month">' + months[d.getMonth()] + "</span>" +
            '<span class="show__day">' + d.getDate() + "</span>" +
            '<span class="show__year">' + d.getFullYear() + "</span>" +
          "</div>" +
          '<div class="show__info">' +
            '<div class="show__venue"></div>' +
            '<div class="show__city"></div>' +
          "</div>" +
          '<div class="show__cta">' + cta + "</div>";

        li.querySelector(".show__venue").textContent = s.venue;
        li.querySelector(".show__city").textContent = s.city;
        list.appendChild(li);
      });
    }
  }

  // Smooth-scroll nav without putting #anchors in the URL,
  // so reloading the page always starts back at the top.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      var startY = window.scrollY;
      target.scrollIntoView({ behavior: "smooth" });
      setTimeout(function () {
        if (Math.abs(window.scrollY - startY) < 2 &&
            Math.abs(target.getBoundingClientRect().top) > 4) {
          target.scrollIntoView({ behavior: "instant" });
        }
      }, 350);
    });
  });

  // Clean up a leftover #hash from an older visit
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
});
