
const Chessman = require('Chessman');
cc.Class({
    extends: Chessman,

    properties: {
        ChessType:2,
    },
    start()
    {
        this._super();
        this.ChessType = ChessTypeEnum.Xiang;
    },
    
    CanMove(rowColumn)
    {
        if(!this._super(rowColumn))
        {
            return false;
        }
        //象走“田”
        if(Math.abs(rowColumn.x - this.RowColPos.x) != 2 || Math.abs(rowColumn.y - this.RowColPos.y) != 2)
        {
            return false;
        }
        //象不能过河
        if(this.Type == 0)
        {
            if(rowColumn.x > 4)
            {
                return false;
            }
        }
        else if(this.Type == 1)
        {
            if(rowColumn.x < 5)
            {
                return false;
            }
        }
        //象眼是否有棋子
        for(let i=0;i<GameControl.RedChesses.length;i++)
        {
            let chess = GameControl.RedChesses[i];
            if(Math.abs(chess.RowColPos.x - this.RowColPos.x) == 1
                && Math.abs(chess.RowColPos.y - this.RowColPos.y) == 1
                && Math.abs(chess.RowColPos.x - rowColumn.x) == 1
                && Math.abs(chess.RowColPos.y - rowColumn.y) == 1)
                {
                    return false;
                }
        }
        for(let i=0;i<GameControl.BlackChesses.length;i++)
        {
            let chess = GameControl.BlackChesses[i];
            if(Math.abs(chess.RowColPos.x - this.RowColPos.x) == 1
                && Math.abs(chess.RowColPos.y - this.RowColPos.y) == 1
                && Math.abs(chess.RowColPos.x - rowColumn.x) == 1
                && Math.abs(chess.RowColPos.y - rowColumn.y) == 1)
                {
                    return false;
                }
        }
        return true;
    },
    getAllMoves()
    {
        let mvs = [];
        //return mvs;
        let leftDownPos = cc.v2(this.RowColPos.x -2, this.RowColPos.y - 2);
        if(this.CanMove(leftDownPos))
        {
            let mv = {chess:this, toPos:leftDownPos};
            mvs.push(mv);
        }
        let leftUpPos = cc.v2(this.RowColPos.x - 2, this.RowColPos.y + 2);
        if(this.CanMove(leftUpPos))
        {
            let mv = {chess:this, toPos:leftUpPos};
            mvs.push(mv);
        }
        let rightDownPos = cc.v2(this.RowColPos.x + 2, this.RowColPos.y - 2);
        if(this.CanMove(rightDownPos))
        {
            let mv = {chess:this, toPos:rightDownPos};
            mvs.push(mv);
        }
        let rightUpPos = cc.v2(this.RowColPos.x + 2, this.RowColPos.y + 2);
        if(this.CanMove(rightUpPos))
        {
            let mv = {chess:this, toPos:rightUpPos};
            mvs.push(mv);
        }
        return mvs;
    }
});
