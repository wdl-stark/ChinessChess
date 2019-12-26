
const Chessman = require('Chessman');
cc.Class({
    extends: Chessman,

    properties: {
        ChessType:5,
    },
    start()
    {
        this._super();
        this.ChessType = ChessTypeEnum.Pao;
    },
    
    CanMove(rowColumn)
    {
        if(!this._super(rowColumn))
        {
            return false;
        }
        if(this.RowColPos.x == rowColumn.x || this.RowColPos.y == rowColumn.y)
        {
            //如果目标点不是一个棋子，且炮与目标点之间没有棋子，则炮可以走过去
            if(!this.CheckLineHasOtherChess(this.RowColPos, rowColumn) && !this.IsPointHasChess(rowColumn))
            {
                return true;
            }
            if(this.IsPointHasChess(rowColumn))
            {
                //如果目标点是一个棋子，且目标点与炮之间有一个棋子，则炮可以吃过去
                if(this.TwoPointHasChessCount(this.RowColPos, rowColumn)==1)
                {
                    return true;
                }
            }
            
        }
        return false;
    },
    IsPointHasChess(rowColumn)
    {
        for(let i=0;i<GameControl.RedChesses.length;i++)
        {
            let chess = GameControl.RedChesses[i];
            if(chess.IsVecEqual(chess.RowColPos, rowColumn)){
                return true;
            }
        }
        for(let i=0;i<GameControl.BlackChesses.length;i++)
        {
            let chess = GameControl.BlackChesses[i];
            if(chess.IsVecEqual(chess.RowColPos, rowColumn)){
                return true;
            }
        }
        return false;
    },
    TwoPointHasChessCount(pos1,pos2){
        if(pos1.x != pos2.x && pos1.y != pos2.y)
        {
            return 0;
        }
        if(pos1.x == pos2.x && pos1.y == pos2.y)
        {
            return 0;
        }
        let hasChessCnt = 0;
        //两点在同一行
        if(pos1.x == pos2.x)
        {
            //检查红棋
            for(let i=0;i<GameControl.RedChesses.length;i++)
            {
                let chessman = GameControl.RedChesses[i];
                //这个子在它们之间
                if(chessman.RowColPos.x == pos1.x)
                {
                    if(pos1.y > pos2.y)
                    {
                        if(chessman.RowColPos.y > pos2.y && chessman.RowColPos.y < pos1.y)
                            hasChessCnt++;
                    }else if(pos1.y < pos2.y)
                    {
                        if(chessman.RowColPos.y > pos1.y && chessman.RowColPos.y < pos2.y)
                            hasChessCnt++;
                    }
                }
            }
            //检查黑棋
            for(let i=0;i<GameControl.BlackChesses.length;i++)
            {
                let chessman = GameControl.BlackChesses[i];
                if(chessman.RowColPos.x == pos1.x)
                {
                    if(pos1.y > pos2.y)
                    {
                        if(chessman.RowColPos.y > pos2.y && chessman.RowColPos.y < pos1.y)
                            hasChessCnt++;
                    }else if(pos1.y < pos2.y)
                    {
                        if(chessman.RowColPos.y > pos1.y && chessman.RowColPos.y < pos2.y)
                            hasChessCnt++;
                    }
                }
            }
        }
        //两点在同一列
        else if(pos1.y == pos2.y)
        {
            for(let i=0;i<GameControl.RedChesses.length;i++)
            {
                let chessman = GameControl.RedChesses[i];
                //这个子在它们之间
                if(chessman.RowColPos.y == pos1.y){
                    if(pos1.x > pos2.x)
                    {
                        if(chessman.RowColPos.x > pos2.x && chessman.RowColPos.x < pos1.x)
                            hasChessCnt++;
                    }else if(pos1.x < pos2.x)
                    {
                        if(chessman.RowColPos.x > pos1.x && chessman.RowColPos.x < pos2.x)
                            hasChessCnt++;
                    }
                }
            }
            for(let i=0;i<GameControl.BlackChesses.length;i++)
            {
                let chessman = GameControl.BlackChesses[i];
                //这个子在它们之间
                if(chessman.RowColPos.y == pos1.y){
                    if(pos1.x > pos2.x)
                    {
                        if(chessman.RowColPos.x > pos2.x && chessman.RowColPos.x < pos1.x)
                            hasChessCnt++;
                    }else if(pos1.x < pos2.x)
                    {
                        if(chessman.RowColPos.x > pos1.x && chessman.RowColPos.x < pos2.x)
                            hasChessCnt++;
                    }
                }
            }
        }
        return hasChessCnt;
    },
    
    getAllMoves()
    {
        let mvs = [];
        //return mvs;
        for(let i = 0;i <= 9;i++)
        {
            if(i == this.RowColPos.x)
            {
                continue;
            }
            let pos = cc.v2(i,this.RowColPos.y);
            if(this.CanMove(pos))
            {
                let mv = {chess:this, toPos:pos};
                mvs.push(mv);
            }
        }
        for(let i=0;i <= 8;i++)
        {
            if(i == this.RowColPos.y)
            {
                continue;
            }
            let pos = cc.v2(this.RowColPos.x,i);
            if(this.CanMove(pos))
            {
                let mv = {chess:this, toPos:pos};
                mvs.push(mv);
            }
        }
        return mvs;
    }
});
