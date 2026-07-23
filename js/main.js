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
            : s.time
              ? '<span class="show__time">' + s.time + "</span>"
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

        // Venue links to Google Maps when an address is provided
        var venueEl = li.querySelector(".show__venue");
        if (s.address) {
          var a = document.createElement("a");
          a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s.venue + ", " + s.address);
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = s.venue;
          venueEl.appendChild(a);
        } else {
          venueEl.textContent = s.venue;
        }
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

  // Photo lightbox: click a gallery photo to view it full-size,
  // arrows or ←/→ keys to move between photos, X or Esc to close.
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector(".lightbox__img");
    var galleryImgs = Array.prototype.slice.call(document.querySelectorAll(".gallery img"));
    var current = 0;

    function showAt(i) {
      current = (i + galleryImgs.length) % galleryImgs.length;
      lbImg.src = galleryImgs[current].src;
      lbImg.alt = galleryImgs[current].alt;
    }
    function openLightbox(i) {
      showAt(i);
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lb.hidden = true;
      lbImg.src = "";
      document.body.style.overflow = "";
    }

    galleryImgs.forEach(function (img, i) {
      img.addEventListener("click", function () { openLightbox(i); });
    });
    lb.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    lb.querySelector(".lightbox__prev").addEventListener("click", function (e) {
      e.stopPropagation(); showAt(current - 1);
    });
    lb.querySelector(".lightbox__next").addEventListener("click", function (e) {
      e.stopPropagation(); showAt(current + 1);
    });
    // Click the dark backdrop (but not the image) to close
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showAt(current - 1);
      else if (e.key === "ArrowRight") showAt(current + 1);
    });
  }
});
