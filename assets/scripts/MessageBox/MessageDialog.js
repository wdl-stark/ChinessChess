
var MessageBox = {};

(function () {
    // MessageBox.OK_CALCEL = 1;
    // MessageBox.OK = 2;
    MessageBox.RETURN_RECONNECT = 3;
    MessageBox.OKCancel = 0;
    MessageBox.OK = 1;
    MessageBox.DeleteOrGet = 2;
    // MessageBox.ReconnectOrReturn = 3;
    MessageBox.Update = 4;
    MessageBox.UpdateOrGoOnGame = 5;

    MessageBox.show = function (message, type, callBack) {
        const instance = cc.instantiate(window.MessageBoxPref);
        instance.parent = cc.find('Canvas');
        instance.zIndex = cc.macro.MAX_ZINDEX;
        let messageDialog = instance.getComponent('MessageDialog');
        messageDialog.show(message, type, callBack);
        // cc.loader.loadRes('MessageBox', cc.Prefab, function(error, prefab){
        //     if(error){
        //         cc.log(error);
        //         return;
        //     }
        //     cc.log("prefab load completed");
        //     let instance = cc.instantiate(prefab);
        //     instance.parent = cc.find('Canvas');
        //     let messageDialog = instance.getComponent('MessageDialog');
        //     messageDialog.show(message, type, callBack);
        // });
    };
    MessageBox.clear = function () {
        // Global.HasPay = false;
        let parent = cc.find('Canvas');
        let childrenArr = parent.children;
        let length = childrenArr.length;
        for(let i = length-1; i >= 0; i--) {
            if (childrenArr[i]){
                if(childrenArr[i].name == "MessageBox"
                    ||childrenArr[i].name=="CommonMessageText"
                    ||childrenArr[i].name == "Shop"
                    ||childrenArr[i].name=="VIPQuickPay"
                    ||childrenArr[i].name=="SuperLuckydrawRecharge"
                    ||childrenArr[i].name=="DailyRecharge"
                    ||childrenArr[i].name == "HappyGift"
                    ||childrenArr[i].name=="FirstPay"
                    ||childrenArr[i].name=="PreferentialRecharge"
                    ||childrenArr[i].name=="GoldQuickPay"
                    ||childrenArr[i].name == "LowGoldQuickPay"
                    ||childrenArr[i].name=="MiddleGoldQuickPay"
                    ||childrenArr[i].name=="HighGoldQuickPay"
                    ||childrenArr[i].name=="LowDiamonQuickPay"
                    ||childrenArr[i].name == "MiddleDiamonQuickPay"
                    ||childrenArr[i].name=="HighDiamonQuickPay"
                    ||childrenArr[i].name=="NobleGift") {
                    // childrenArr[i].removeFromParent();
                    childrenArr[i].destroy();
                }
            }

        }
    };
    window.MessageBox = MessageBox;
})();


cc.Class({
    extends: cc.Component,

    properties: {
        okButton: {
            default: null,
            type: cc.Node
        },

        cancelButton: {
            default: null,
            type: cc.Node
        },

        oKImage: {
            default: null,
            type: cc.Label
        },
        cancelImage: {
            default: null,
            type: cc.Label
        },

        contentLabel: {
            default: null,
            type: cc.Label
        },

        okSprite: {
            default: null,
            type: cc.SpriteFrame
        },

        cancelSprite: {
            default: null,
            type: cc.SpriteFrame
        },

        return2LoginSpite: {
            default: null,
            type: cc.SpriteFrame
        },

        reconnectSprite: {
            default: null,
            type: cc.SpriteFrame
        },

        __callBack: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //this.callBack = null;
    },


    show: function (content, type, callBack) {
        let self = this;
        switch (type) {
            case MessageBox.OKCancel:
                this.oKImage.string = "确 定";
                this.cancelImage.string = "取 消";
                break;
            case MessageBox.OK:
                this.oKImage.string = "确 定";
                this.okButton.x = 0;
                this.cancelButton.active = false;
                break;
            case MessageBox.DeleteOrGet:
                this.oKImage.string = "确 定";
                this.cancelImage.string = "取 消";
                break;
            case MessageBox.RETURN_RECONNECT:
                this.oKImage.string = "重新连接";
                this.cancelImage.string = "返回登录";
                break;
            case MessageBox.Update:
                this.oKImage.string = "前往更新";
                this.okButton.x = 0;
                this.cancelButton.active = false;
                break;
            case MessageBox.UpdateOrGoOnGame:
                this.oKImage.string = "前往更新";
                this.cancelImage.string = "继续游戏";
            default:
                break;
        }
        this.__callBack = callBack;
        self.contentLabel.string = content;
        
    },

    onOKButtonClicked: function () {
        if (this.__callBack) {
            this.__callBack(true);
        }
        this.node.destroy();
    },

    onCancelButtonClicked: function () {
        if (this.__callBack) {
            this.__callBack(false);
        }
        this.node.destroy();
    }
    // update (dt) {},
});
