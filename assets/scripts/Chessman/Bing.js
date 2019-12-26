
const Chessman = require('Chessman');
cc.Class({
    extends: Chessman,

    properties: {
        ChessType:6,
    },
    start()
    {
        this._super();
        this.ChessType = ChessTypeEnum.Bing;
    },

    
    CanMove(rowColumn)
    {
        if(!this._super(rowColumn))
        {
            return false;
        }
        //红兵
        if(this.Type == 0)
        {
            //不能倒退
            if(rowColumn.x < this.RowColPos.x)
            {
                return false;
            }
            //兵只能走一步
            if(Math.abs(this.RowColPos.x - rowColumn.x) + Math.abs(this.RowColPos.y - rowColumn.y)>1)
            {
                return false;
            }
            //兵未过河不能横走
            if(this.RowColPos.x <= 4)
            {
                if(rowColumn.y != this.RowColPos.y)
                {
                    return false;
                }
            }
            return true;
        }else
        {
            //不能倒退
            if(rowColumn.x > this.RowColPos.x)
            {
                return false;
            }
            //兵只能走一步
            if(Math.abs(this.RowColPos.x - rowColumn.x) + Math.abs(this.RowColPos.y - rowColumn.y)>1)
            {
                return false;
            }
            //兵未过河不能横走
            if(this.RowColPos.x >= 5)
            {
                if(rowColumn.y != this.RowColPos.y)
                {
                    return false;
                }
            }
            return true;
        }
    },
    getAllMoves()
    {
        let mvs = [];
        let xOffset = this.Type == 0 ? 1 : -1;
        let pt = cc.v2(this.RowColPos.x + xOffset, this.RowColPos.y);
        if(this.CanMove(pt))
        {
            let mv = {chess:this, toPos:pt};
            mvs.push(mv); 
        }
        pt = cc.v2(this.RowColPos.x, this.RowColPos.y - 1);
        if(this.CanMove(pt))
        {
            let mv = {chess:this, toPos:pt};
            mvs.push(mv); 
        }
        pt = cc.v2(this.RowColPos.x, this.RowColPos.y + 1);
        if(this.CanMove(pt))
        {
            let mv = {chess:this, toPos:pt};
            mvs.push(mv); 
        }
        return mvs;
    }
});
