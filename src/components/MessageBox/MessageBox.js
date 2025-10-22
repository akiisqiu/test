import { h, ref, createApp, nextTick } from "vue";
import messageBox from "./MessageBox.vue";
import ElementPlus from 'element-plus'
const boxMap = {}

export default function MessageBox(text, title, options, key) {

  return new Promise((resolve, reject) => {
    if (key && boxMap[key]) return
    let messageBoxRef = ref();
    const mountNode = document.createElement("div");
    mountNode.style.position = "fixed";
    mountNode.style.left = "0";
    mountNode.style.top = "0";
    mountNode.style.width = "100vw";
    mountNode.style.zIndex = "9999";
    document.body.appendChild(mountNode);
    const destroy = () => {
      nextTick(() => mountNode.remove());
      if (key) {
        delete boxMap[key];
      }
      app.unmount();
    };
    const app = createApp({
      render() {
        return h(messageBox, {
          ref: messageBoxRef,
          title: title,
          text: text,
          options: options,
          onSubmit: () => {
            destroy();
            resolve();
          },
          onClosed: () => {
            destroy();
            reject();
          },
        });
      },
    });
    app.mount(mountNode);
    app.use(ElementPlus);

    messageBoxRef.value.show();

    if (key) {
      boxMap[key] = {
        component: app,
        ref: messageBoxRef,
      };
    }
  });
}
