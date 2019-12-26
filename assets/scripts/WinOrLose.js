
cc.Class({
    extends: cc.Component,

    properties: {
        ResultSprite:[cc.SpriteFrame],

    },

    SetData(result)
    {
        this.node.getComponent(cc.Sprite).spriteFrame = this.ResultSprite[result];
    }
});
