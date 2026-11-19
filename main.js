document.addEventListener("DOMContentLoaded", function () {
  /* Responsive navbar toggle */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    function setNavState(open) {
      navMenu.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setNavState(!isOpen);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavState(false);
      });
    });

    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        setNavState(false);
      }
    });
  }

  /* Sprint board */
  var cols = ["To do", "In progress", "Done"];
  var tasks = [
    { t: "Wireframe landing page", c: 0 },
    { t: "Build responsive navbar", c: 1 },
    { t: "Stakeholder review", c: 0 },
    { t: "Accessibility audit", c: 1 },
    { t: "Set up CI pipeline", c: 2 },
    { t: "Sprint demo", c: 0 }
  ];
  var root = document.getElementById("cols");

  function draw() {
    if (!root) return;
    root.innerHTML = "";
    cols.forEach(function (n, i) {
      var c = document.createElement("div");
      c.className = "col";

      var s = document.createElement("span");
      s.textContent = n;
      c.appendChild(s);

      tasks.forEach(function (k) {
        if (k.c !== i) return;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "card" + (i === 2 ? " d" : i === 1 ? " c" : "");
        b.textContent = k.t;
        b.setAttribute("aria-label", k.t + ", " + n + ". Move on");
        b.onclick = function () {
          k.c = (k.c + 1) % 3;
          draw();
        };
        c.appendChild(b);
      });

      root.appendChild(c);
    });
  }

  draw();

  /* Skills bars animation */
  var skillsSection = document.getElementById("skills");
  if (skillsSection) {
    var bars = Array.prototype.slice.call(skillsSection.querySelectorAll(".bar i b"));
    bars.forEach(function (bar) {
      var inlineWidth = bar.style.width;
      if (inlineWidth) {
        bar.style.setProperty("--target-w", inlineWidth);
        bar.style.width = "0%";
      }
    });

    function showBars() {
      bars.forEach(function (bar) {
        var target = bar.style.getPropertyValue("--target-w");
        if (target) {
          bar.style.width = target;
        }
      });
      skillsSection.classList.add("is-animated");
    }

    var prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      showBars();
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              showBars();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(skillsSection);
    }
  }

  /* Project management tabs */
  var pmSection = document.getElementById("pm");
  var pmTablist = document.getElementById("pmtabs");
  var pmView = document.getElementById("pmview");

  if (pmSection && pmTablist && pmView) {
    var pmTabs = Array.prototype.slice.call(pmTablist.querySelectorAll('[role="tab"]'));

    var renders = [
      // 0: Gantt
      function () {
        var rows = [
          { name: "Kick-off & scope", start: 1, span: 2, cls: "thick" },
          { name: "Research & wireframes", start: 2, span: 2, cls: "thick" },
          { name: "UI design", start: 3, span: 2, cls: "thick c" },
          { name: "Frontend build", start: 4, span: 3, cls: "thick" },
          { name: "Testing & fixes", start: 6, span: 2, cls: "thick ok" },
          { name: "Go-live milestone", start: 8, span: 1, cls: "thick c" }
        ];
        var weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

        var html = '<div class="gt-wrap"><div class="gt">';
        html += '<div class="gr hd"><span>Task</span>';
        weeks.forEach(function (w) {
          html += "<span>" + w + "</span>";
        });
        html += "</div>";

        rows.forEach(function (r) {
          html += '<div class="gr"><span class="task-name">' + r.name + "</span>";
          for (var w = 1; w <= 8; w++) {
            if (w === r.start) {
              html +=
                '<div style="grid-column: span ' +
                r.span +
                '"><div class="gb ' +
                r.cls +
                '"></div></div>';
              w += r.span - 1;
            } else {
              html += "<span></span>";
            }
          }
          html += "</div>";
        });

        html += "</div></div>";
        html += '<p class="note">Coral bars sit on the critical path: a delay there moves the launch date.</p>';
        return html;
      },

      // 1: WBS
      function () {
        return (
          '<div class="wbs-wrap"><div class="wbs">' +
          '<div class="wbs-top">Retail Website Launch</div>' +
          '<div class="wc"><h4>1. Planning</h4><p>Project charter<br>Sprint backlog<br>Content plan</p></div>' +
          '<div class="wc"><h4>2. Design</h4><p>User flows<br>Mobile & desktop UI<br>Design tokens</p></div>' +
          '<div class="wc"><h4>3. Development</h4><p>Responsive templates<br>Cart & checkout<br>CMS setup</p></div>' +
          '<div class="wc"><h4>4. Launch</h4><p>QA checklist<br>Stakeholder sign-off<br>Go-live & support</p></div>' +
          "</div></div>"
        );
      },

      // 2: RACI
      function () {
        var matrix = [
          ["Scope & timeline", "A", "R", "C", "I"],
          ["Wireframes & UI", "C", "A", "R", "I"],
          ["Frontend build", "I", "C", "A", "R"],
          ["QA & launch sign-off", "A", "C", "R", "I"]
        ];

        var html =
          '<div class="tw"><table><thead><tr>' +
          "<th>Deliverable</th>" +
          '<th class="c">PM</th>' +
          '<th class="c">Designer</th>' +
          '<th class="c">Developer</th>' +
          '<th class="c">Client</th>' +
          "</tr></thead><tbody>";

        matrix.forEach(function (row) {
          html += "<tr><td>" + row[0] + "</td>";
          for (var i = 1; i < row.length; i++) {
            var code = row[i];
            html += '<td class="c"><span class="rb ' + code + '">' + code + "</span></td>";
          }
          html += "</tr>";
        });

        html += "</tbody></table></div>";
        html +=
          '<p class="raci-leg"><b>R</b> does the work, <b>A</b> owns the result (only one per task), <b>C</b> is consulted, <b>I</b> is informed.</p>';
        return html;
      },

      // 3: Risk register
      function () {
        var risks = [
          ["Client content arrives late", "High", "hi", "Medium", "md", "Fixed content deadline in week 2, placeholder text as backup", "PM"],
          ["Scope creep", "Medium", "md", "High", "hi", "Change request form, review weekly", "PM"],
          ["Browser bugs found late", "Medium", "md", "Medium", "md", "Test on real devices from week 5", "Developer"],
          ["Key person unavailable", "Low", "lo", "High", "hi", "Shared docs, a named backup", "PM"]
        ];

        var html =
          '<div class="tw"><table><thead><tr>' +
          "<th>Risk</th>" +
          "<th>Chance</th>" +
          "<th>Impact</th>" +
          "<th>Response</th>" +
          "<th>Owner</th>" +
          "</tr></thead><tbody>";

        risks.forEach(function (r) {
          html +=
            "<tr>" +
            "<td>" + r[0] + "</td>" +
            '<td><span class="pill ' + r[2] + '">' + r[1] + "</span></td>" +
            '<td><span class="pill ' + r[4] + '">' + r[3] + "</span></td>" +
            "<td>" + r[5] + "</td>" +
            "<td>" + r[6] + "</td>" +
            "</tr>";
        });

        html += "</tbody></table></div>";
        return html;
      },

      // 4: Status report
      function () {
        return (
          '<div class="rag">' +
          '<div><b><span class="dot" style="background:var(--ok,#12805C)"></span>Schedule: On Track</b>Week 5 of 8; core pages in review.</div>' +
          '<div><b><span class="dot" style="background:var(--blue,#0A5CFF)"></span>Budget: Within Plan</b>60% spent against 62.5% elapsed timeline.</div>' +
          '<div><b><span class="dot" style="background:var(--coral,#FF6A4D)"></span>Risks: 1 Watch</b>Waiting on final promo banner copy.</div>' +
          "</div>" +
          '<div class="pg-label"><span>Overall Progress</span><span>62%</span></div>' +
          '<div class="pg"><i></i></div>' +
          '<div class="status-cols">' +
          "<div><b>Completed this week</b><p>Responsive navigation & hero<br>Mobile checkout prototype<br>Accessibility contrast check</p></div>" +
          "<div><b>Next up</b><p>Cart state & form validation<br>Cross-browser mobile testing<br>Weekly stakeholder demo</p></div>" +
          "</div>"
        );
      }
    ];

    function selectPmTab(index) {
      pmTabs.forEach(function (tab, i) {
        var active = i === index;
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.setAttribute("tabindex", active ? "0" : "-1");
      });
      if (renders[index]) {
        pmView.innerHTML = renders[index]();
      }
    }

    var startIdx = 0;
    pmTabs.forEach(function (tab, i) {
      if (tab.getAttribute("aria-selected") === "true") {
        startIdx = i;
      }
      tab.addEventListener("click", function () {
        selectPmTab(i);
      });
      tab.addEventListener("keydown", function (e) {
        var nextIdx = null;
        if (e.key === "ArrowRight") {
          nextIdx = (i + 1) % pmTabs.length;
        } else if (e.key === "ArrowLeft") {
          nextIdx = (i - 1 + pmTabs.length) % pmTabs.length;
        }
        if (nextIdx !== null) {
          e.preventDefault();
          selectPmTab(nextIdx);
          pmTabs[nextIdx].focus();
        }
      });
    });

    selectPmTab(startIdx);
  }

  /* Contact email copy */
  var contactSection = document.getElementById("contact");
  if (contactSection) {
    var emailLink = contactSection.querySelector("a.big");
    var ctaBox = contactSection.querySelector(".cta");
    if (emailLink && ctaBox) {
      var note = document.createElement("div");
      note.className = "copy-note";
      note.setAttribute("role", "status");
      note.setAttribute("aria-live", "polite");
      emailLink.insertAdjacentElement("afterend", note);

      var timer;
      emailLink.addEventListener("click", function () {
        var emailText = emailLink.textContent.trim();
        if (!emailText) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(emailText)
            .then(function () {
              note.textContent = "Copied " + emailText + " to clipboard.";
              clearTimeout(timer);
              timer = setTimeout(function () {
                note.textContent = "";
              }, 2500);
            })
            .catch(function () {});
        }
      });
    }
  }

  /* Portfolio filter & smooth 1-row carousel */
  var lightbox =
    typeof GLightbox === "function"
      ? GLightbox({
          touchNavigation: true,
          loop: true
        })
      : null;

  var portfolioGrid = document.getElementById("portfolioGrid");
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));
  var allItems = Array.prototype.slice.call(document.querySelectorAll(".portfolio-item"));
  var prevBtn = document.getElementById("pfPrev");
  var nextBtn = document.getElementById("pfNext");
  var navWrap = document.getElementById("portfolioNav");

  var activeFilterBtn = document.querySelector(".tab-btn.active");
  var currentFilter =
    (activeFilterBtn && activeFilterBtn.getAttribute("data-filter")) || "web";
  var currentSlide = 1;
  var swapTimer = null;

  function getPerSlide() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  }

  function getMatchingItems() {
    return allItems.filter(function (item) {
      var cat = item.getAttribute("data-category");
      return currentFilter === "all" || cat === currentFilter;
    });
  }

  function applyItems() {
    var matching = getMatchingItems();
    var perSlide = getPerSlide();
    var totalSlides = Math.max(1, Math.ceil(matching.length / perSlide));

    if (currentSlide > totalSlides) currentSlide = 1;

    var start = (currentSlide - 1) * perSlide;
    var end = start + perSlide;

    allItems.forEach(function (item) {
      item.style.display = "none";
    });

    matching.slice(start, end).forEach(function (item) {
      item.style.display = "block";
    });

    if (navWrap) {
      navWrap.style.display = matching.length > perSlide ? "flex" : "none";
    }
    if (prevBtn) prevBtn.disabled = currentSlide <= 1;
    if (nextBtn) nextBtn.disabled = currentSlide >= totalSlides;

    if (lightbox && typeof lightbox.reload === "function") {
      lightbox.reload();
    }
  }

  function updateView(animate) {
    var shouldAnimate =
      animate !== false &&
      portfolioGrid &&
      !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (!shouldAnimate) {
      applyItems();
      return;
    }

    clearTimeout(swapTimer);
    portfolioGrid.classList.add("is-swapping");

    swapTimer = setTimeout(function () {
      applyItems();
      requestAnimationFrame(function () {
        portfolioGrid.classList.remove("is-swapping");
      });
    }, 160);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");
      currentFilter = button.getAttribute("data-filter") || "web";
      currentSlide = 1;
      updateView(true);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      if (currentSlide > 1) {
        currentSlide -= 1;
        updateView(true);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      var matching = getMatchingItems();
      var totalSlides = Math.ceil(matching.length / getPerSlide());
      if (currentSlide < totalSlides) {
        currentSlide += 1;
        updateView(true);
      }
    });
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      updateView(false);
    }, 120);
  });

  updateView(false);

  /* Product design tabs */
  var designSection = document.getElementById("design");
  var designTablist = document.getElementById("dtabs");

  if (designSection && designTablist) {
    var designTabs = Array.prototype.slice.call(designTablist.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(designSection.querySelectorAll(".panel.dp"));

    function activateDesignTab(index) {
      designTabs.forEach(function (tab, i) {
        var selected = i === index;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.setAttribute("tabindex", selected ? "0" : "-1");
      });

      panels.forEach(function (panel, i) {
        panel.hidden = i !== index;
      });
    }

    var initialIndex = -1;
    designTabs.forEach(function (t, idx) {
      if (initialIndex === -1 && t.getAttribute("aria-selected") === "true") {
        initialIndex = idx;
      }
    });
    activateDesignTab(initialIndex >= 0 ? initialIndex : 0);

    designTabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateDesignTab(index);
      });

      tab.addEventListener("keydown", function (e) {
        var targetIndex = null;
        if (e.key === "ArrowRight") {
          targetIndex = (index + 1) % designTabs.length;
        } else if (e.key === "ArrowLeft") {
          targetIndex = (index - 1 + designTabs.length) % designTabs.length;
        }

        if (targetIndex !== null) {
          e.preventDefault();
          activateDesignTab(targetIndex);
          designTabs[targetIndex].focus();
        }
      });
    });
  }
});