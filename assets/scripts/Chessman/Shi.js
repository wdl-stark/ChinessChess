
const Chessman = require('Chessman');
cc.Class({
    extends: Chessman,

    properties: {
        ChessType:1,
    },
    start(){
        this._super();
        this.ChessType = ChessTypeEnum.Shi;
        this.ShiCanStandPos = [];
        if(this.Type == 0){
            this.ShiCanStandPos = GameControl.RedShiStandPos;
        }else if(this.Type == 1)
        {
            this.ShiCanStandPos = GameControl.BlackShiStandPos;
        }
    },
    
    CanMove(rowColumn)
    {
        if(!this._super(rowColumn))
        {
            return false;
        }
        let isOneOfShiPos = false;
        for(let i=0; i < this.ShiCanStandPos.length;i++)
        {
            if(this.IsVecEqual(rowColumn, this.ShiCanStandPos[i]))
            {
                isOneOfShiPos = true;
            }
        }
        //如果不是士合法位置，直接返回false
        if(!isOneOfShiPos)
        {
            return false;
        }

        let myAllChess = this.Type == 0 ? GameControl.RedChesses : GameControl.BlackChesses;
        for(let i=0;i<myAllChess.length;i++)
        {
            //如果士要移动到的位置上有自己的其他子,则不能移动到该位置
            if(this.IsVecEqual(myAllChess[i].RowColPos,rowColumn))
            {
                return false;
            }
        }

        //本来在四个角
        if(!this.IsVecEqual(this.RowColPos, this.ShiCanStandPos[0]))
        {
            //只能走到中间
            if(this.IsVecEqual(rowColumn, this.ShiCanStandPos[0]))
            {
                return true;
            }
            return false;
        }
        //本来在中间,可以移动到四个角的任何一个位置
        return true;
        
    },
    getAllMoves()
    {
        //士的所有走法
        let mvs = [];
        //return mvs;
        let leftDownPos = cc.v2(this.RowColPos.x -1, this.RowColPos.y - 1);
        if(this.CanMove(leftDownPos))
        {
            let mv = {chess:this, toPos:leftDownPos};
            mvs.push(mv);
        }
        let leftUpPos = cc.v2(this.RowColPos.x - 1, this.RowColPos.y + 1);
        if(this.CanMove(leftUpPos))
        {
            let mv = {chess:this, toPos:leftUpPos};
            mvs.push(mv);
        }
        let rightDownPos = cc.v2(this.RowColPos.x + 1, this.RowColPos.y - 1);
        if(this.CanMove(rightDownPos))
        {
            let mv = {chess:this, toPos:rightDownPos};
            mvs.push(mv);
        }
        let rightUpPos = cc.v2(this.RowColPos.x + 1, this.RowColPos.y + 1);
        if(this.CanMove(rightUpPos))
        {
            let mv = {chess:this, toPos:rightUpPos};
            mvs.push(mv);
        }
        return mvs;
    }
});
