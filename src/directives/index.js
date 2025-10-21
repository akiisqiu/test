const directives = import.meta.glob("./modules/*.js", {
  import: "default",
  eager: true,
});

let installed = false;

const install = function (Vue) {
  if (installed) return;
  installed = true;

  Object.keys(directives).forEach((key) => {
    const k = key.slice(key.lastIndexOf("/") + 1, -3);
    const name = 'Ea' + k.charAt(0).toUpperCase() + k.slice(1);
    Vue.directive(name, directives[key]);
  });
};

export default install;
