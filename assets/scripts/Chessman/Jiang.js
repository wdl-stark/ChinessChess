
const Chessman = require('Chessman');
cc.Class({
    extends: Chessman,

    properties: {
        ChessType:0,
    },
    start(){
        this._super();
        this.JiangCanStandPos = [];
        this.ChessType = ChessTypeEnum.Jiang;
        if(this.Type == 0)
        {
            this.JiangCanStandPos = GameControl.RedJiangStandPos;
        }else{
            this.JiangCanStandPos = GameControl.BlackJiangStandPos;
        }
    },
    
    
    CanMove(rowColumn)
    {
        if(!this._super(rowColumn))
        {
            return false;
        }
        if(this.IsKingFace())
        {
            return true;
        }
        //如果不在九宫格里之间返回false
        let isRightPos = false;
        for(let i=0;i<this.JiangCanStandPos.length;i++)
        {
            if(this.IsVecEqual(rowColumn, this.JiangCanStandPos[i]))
            {
                isRightPos = true;
            }
        }
        if(!isRightPos)
        {
            return false;
        }
        //将只能走一步
        if(Math.abs(this.RowColPos.x - rowColumn.x) + Math.abs(this.RowColPos.y - rowColumn.y)>1)
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

        return true;
    },
    IsKingFace()
    {
        let allOpponentChess = this.Type == 0 ? GameControl.BlackChesses : GameControl.RedChesses;
        for(let i=0;i<allOpponentChess.length;i++)
        {
            let chess = allOpponentChess[i];
            if(chess.ChessType == ChessTypeEnum.Jiang)
            {
                if(chess.RowColPos.y == this.RowColPos.y)
                {
                    if(!this.CheckLineHasOtherChess(chess.RowColPos, this.RowColPos))
                    {
                        return true;
                    }
                }
            }
        }
        return false; 
    },
    getAllMoves()
    {
        let mvs = [];
        //return mvs;
        let leftPos = cc.v2(this.RowColPos.x, this.RowColPos.y - 1);
        if(this.CanMove(leftPos))
        {
            let mv = {chess:this, toPos:leftPos};
            mvs.push(mv);
        }
        let rightPos = cc.v2(this.RowColPos.x, this.RowColPos.y + 1);
        if(this.CanMove(rightPos))
        {
            let mv = {chess:this, toPos:rightPos};
            mvs.push(mv);
        }
        let upPos = cc.v2(this.RowColPos.x + 1, this.RowColPos.y);
        if(this.CanMove(upPos))
        {
            let mv = {chess:this, toPos:upPos};
            mvs.push(mv);
        }
        let downPos = cc.v2(this.RowColPos.x - 1, this.RowColPos.y);
        if(this.CanMove(downPos))
        {
            let mv = {chess:this, toPos:downPos};
            mvs.push(mv);
        }
        return mvs;
    }
});
