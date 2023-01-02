const EC = new Eclipse({
  prefix: "/service/",
  codec: "random",
  bare: "https://uv.sys32.dev/"
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