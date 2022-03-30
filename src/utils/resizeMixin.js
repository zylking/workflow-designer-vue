import {debounce} from "./index";

const resize = {

  data() {
    return {
      __resizeHandler: null
    };
  },

  mounted() {
    this.__resizeHandler = debounce(() => {
      this.windowResize();
    }, 200);

    window.addEventListener('resize', this.__resizeHandler);
  },

  methods: {
    windowResize() {
      console.log('resizeMixin => resize');
    }
  },

  destroyed() {
    window.removeEventListener('resize', this.__resizeHandler);
  }
};

export default resize;
