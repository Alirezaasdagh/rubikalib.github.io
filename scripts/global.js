checkUrl([
  {
    key: "darkmode",
    do: () => {
      localStorage.setItem("theme", "dark");
    },
  },
  {
    key: "lightmode",
    do: () => {
      localStorage.setItem("theme", "light");
    },
  },
]).then(() => {
  const dark = window.localStorage.getItem("theme") === "dark";
  if (dark) {
    document.head.innerHTML +=
      '<link rel="stylesheet" href="styles/dark/index.css"/>';
    document.body.innerHTML +=
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sweetalert2/themes@5.0.2/wordpress-admin/wordpress-admin.css" />';
  }

  const loaded = {
    footer: false,
    header: false,
  };

  if (!$("#header")) loaded.header = true;

  $("#header").addEventListener("load", function () {
    const header = $("#header").contentDocument;

    header.querySelectorAll(".nav-link").forEach((element, i) => {
      if (i == 5 && dark) {
        element.innerHTML = element.innerHTML
          .replace("moon", "sun")
          .replace("شب", "روز");

        element.setAttribute(
          "event",
          element.getAttribute("event").replace(/darkmode/g, "lightmode")
        );
      }

      element.onclick = () => {
        const attr = element.getAttribute("event");
        if (attr === "showLicense") {
          showLicense();
        } else {
          goto(attr);
        }
      };
    });

    header.querySelector("a.special").onclick = () => {
      window.scrollTo(0, innerHeight);
    };

    header.querySelector("a.navbar-brand").onclick = () => {
      goto("index.html");
    };

    loaded.header = true;

    setTimeout(() => {
      onDatasLoaded(loaded.header, loaded.footer);
    }, 1500);
  });

  if (!$("#footer")) loaded.footer = true;

  $("#footer").onload = () => {
    const footer = $("#footer").contentDocument;
    footer.querySelectorAll(".nav-link").forEach((element) => {
      element.onclick = () => {
        const attr = element.getAttribute("event");
        goto(attr, "_blank");
      };
    });

    loaded.footer = true;

    setTimeout(() => {
      onDatasLoaded(loaded.header, loaded.footer);
    }, 1500);
  };

  setTimeout(() => {
    onDatasLoaded(loaded.header, loaded.footer);
  }, 1500);
});

function showLicense() {
  fetch("LICENSE")
    .then((data) => data.text())
    .then((result) => {
      result = result.replace("\n", "<br>");
      Swal.fire("", result);
    });
}

async function goto(link = "", target = "") {
  const a = document.createElement("a");
  let url = location.origin;

  if (
    location.pathname.split("/").length > 3 ||
    window.location.pathname.split(".").length !== 2
  ) {
    url = location.origin + "/" + location.pathname.split("/")[1];
  }

  url += url.endsWith("/") ? "" : "/";

  a.href = url + "redirect.htm?redirect=" + link;
  a.target = target;
  a.click();
}

(async function noCache() {
  $("*[src]").forEach((el) => {
    el.src = el.src + "?" + Date.now();
  });

  // $("*[href]").forEach((el) => {
  //   el.href = el.href + "?" + Date.now();
  // });
})();

function onDatasLoaded(header, footer) {
  if (header && footer) {
    const menu =
        ($("main section:not(.document) ol").innerHTML == undefined ||
          $("main section:not(.document) ol").innerHTML == "") &&
        $("#error") == undefined,
      doc = $(".document") == undefined && $("#error") == undefined,
      versions = $("main .col-12") === undefined;

    if (menu && doc && versions) {
      console.log("redirect");
      location.reload();
    }
  }
}
