const EC = new Eclipse({
  prefix: "/testinglol/",
  bare: "https://uv.holyubofficial.net"
})

console.log(EC)

var search = document.getElementById("search")

search.addEventListener("keyup", function(e) {
  if (e.target.value && e.key == "Enter") {
    e.preventDefault();
    window.location.href = EC.url(EC.search(e.target.value, "https://www.google.com/search?q=%s"))
    e.target.value = ""
  }
});