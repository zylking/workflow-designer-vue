/**
 * 封装原element的组件
 * messageBox 弹框、message消息提示
 * @author zyl
 */
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';

// 上一次message实例
let currentMessage = null;

const messageBox = {
  // 自定义Message消息提示，每次只显示1个错误。默认消息提示为3秒，错误提示5秒
  promptMessage: function ({type, message, duration = 3000}) {
    if (currentMessage && !currentMessage.closed) currentMessage.close();
    currentMessage = Message({type, message, duration});
  },

  // 自定义是否确认继续操作messageBox
  confirmMessageBox: function (message, title, type, callback, cancel) {
    MessageBox.confirm(message, title, {
      customClass: 'custom-toast-dialog',
      type: type ? type : 'warning',
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false
    }).then(() => {
      callback && callback();
    }).catch(() => {
      cancel && cancel();
    });
  }
};

export default messageBox;
