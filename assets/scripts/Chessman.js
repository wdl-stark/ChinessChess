
const HighZIndex = 10;
const LowZIndex = 0;
cc.Class({
    extends: cc.Component,

    properties: {
        Type:0,
        ChessType:-1,
        _pos:null,
        Pos:{
            get()
            {
                return this._pos;
            },
            set(value)
            {
                this._pos = value;
            }
        },
        RowColPos:cc.Vec2,
        SelectedNode:cc.Node,
        _isSelected:false,
        IsSelected:
        {
            get()
            {
                return this._isSelected;
            },
            set(value)
            {
                this._isSelected = value;
                this.SelectedNode.active = value && (GameControl.IsRedTurn && this.Type == 0 || !GameControl.IsRedTurn && this.Type == 1);
            }
        }
    },

    start()
    {
        this.node.zIndex = LowZIndex;
        
    },

    MoveTo(pos)
    {
        let time = 0.5;
        this.node.zIndex = HighZIndex;
        const seq = cc.sequence(cc.moveTo(time,pos),cc.callFunc(()=>{
            this.node.zIndex = LowZIndex;
            this.Pos = pos;
        }));
        this.node.runAction(seq);
        return time;
    },
    OnSelectClick()
    {   
        // if((new Date()).valueOf() - GameControl.lastMoveTime < 1000)
        // {
        //     return;
        // }
        if(!GameControl.GameStart)
        {
            return;
        }
        if(GameControl.ActionStatus == GameControl.ActionStatusEnum.None){
            if((GameControl.IsRedTurn && this.Type == 1)
            || (!GameControl.IsRedTurn && this.Type == 0)){
                return;
            }
            
            
            GameControl.ActionStatus = GameControl.ActionStatusEnum.Select;
            this.IsSelected = true;
            GameControl.SelectedChess = this;
        }
        //选择一个棋子之后再单击这个棋子，则为吃这个棋子或者重新选择自己的棋子 
        else if(GameControl.ActionStatus == GameControl.ActionStatusEnum.Select)
        {
            if(GameControl.SelectedChess != null)
            {
                //判断能不能吃，是否是对方的棋子
                if(GameControl.SelectedChess.Type != this.Type)
                {
                    if(GameControl.SelectedChess.CanMove(this.RowColPos))
                    {
                        //先检查走这步棋之后是不是送将，是的话则不能走这步棋
                        let pt = GameControl.SelectedChess.RowColPos;
                        GameControl.SelectedChess.RowColPos = this.RowColPos;
                        if(this.Type == 0)
                        {
                            GameControl.RedChesses.delete(this);
                        }else{
                            GameControl.BlackChesses.delete(this);
                        }
                        if(GameControl.CheckJiang(true))
                        {
                            if(this.Type == 0)
                            {
                                GameControl.RedChesses.push(this);
                            }else{
                                GameControl.BlackChesses.push(this);
                            }
                            GameControl.SelectedChess.RowColPos = pt;
                            return;
                        }
                        if(this.Type == 0)
                        {
                            GameControl.RedChesses.push(this);
                        }else{
                            GameControl.BlackChesses.push(this);
                        }
                        GameControl.SelectedChess.RowColPos = pt;
                        //如果不是送将则可以走这步棋
                        GameControl.SelectedChess.IsSelected = false;
                        GameControl.Eat(this);
                        GameControl.ActionStatus = GameControl.ActionStatusEnum.None;
                    }
                }
                //选的是自己的棋子，判定为重新选棋
                else{
                    GameControl.SelectedChess.IsSelected = false;
                    GameControl.SelectedChess = this;
                    this.IsSelected = true;
                }
            }           
        }
    },
    
    CanMove(rowColumn)
    {
        //超出棋盘的点
        if(rowColumn.x < 0 || rowColumn.y<0 || rowColumn.x > 9 || rowColumn.y > 8)
        {
            return false;
        }
        
        let myAllChess = this.Type == 0 ? GameControl.RedChesses : GameControl.BlackChesses;
        for(let i=0;i<myAllChess.length;i++)
        {
            let chess = myAllChess[i];
            if(this.IsVecEqual(rowColumn, chess.RowColPos))
            {
                //目标点有自己的棋子，则不能移动到目标点
                return false;
            }
        }
        return true;
    },
    

    //检查两直线点之间有没有其他棋子
    CheckLineHasOtherChess(pos1,pos2)
    {
        if(GameControl==null)
        {
            return false;
        }
        //两点在同一行
        if(pos1.x == pos2.x){
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
                            return true;
                    }else if(pos1.y < pos2.y)
                    {
                        if(chessman.RowColPos.y > pos1.y && chessman.RowColPos.y < pos2.y)
                            return true;
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
                            return true;
                    }else if(pos1.y < pos2.y)
                    {
                        if(chessman.RowColPos.y > pos1.y && chessman.RowColPos.y < pos2.y)
                            return true;
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
                            return true;
                    }else if(pos1.x < pos2.x)
                    {
                        if(chessman.RowColPos.x > pos1.x && chessman.RowColPos.x < pos2.x)
                            return true;
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
                            return true;
                    }else if(pos1.x < pos2.x)
                    {
                        if(chessman.RowColPos.x > pos1.x && chessman.RowColPos.x < pos2.x)
                            return true;
                    }
                }
            }
        }
        return false;
    },
    IsVecEqual(vec1,vec2)
    {
        if(vec1.x == vec2.x && vec1.y == vec2.y)
        {
            return true;
        }
        return false;
    },
    //检查是否将军
    CheckJiang()
    {
        let mvs = this.getAllMoves();
        for(let i=0;i<mvs.length;i++)
        {
            let mv = mvs[i];
            let point = mv.toPos;
            if(this.Type == 0)
            {
                for(let j=0;j<GameControl.BlackChesses.length;j++)
                {
                    let chess = GameControl.BlackChesses[j];
                    if(chess.ChessType == 0)
                    {
                        //将在这个位置
                        if(this.IsVecEqual(point, chess.RowColPos))
                        {
                            return true;
                        }
                    }
                }
            }
            else if(this.Type == 1)
            {
                for(let j=0;j<GameControl.RedChesses.length;j++)
                {
                    let chess = GameControl.RedChesses[j];
                    if(chess.ChessType == 0)
                    {
                        //将在这个位置
                        if(this.IsVecEqual(point, chess.RowColPos))
                        {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
});
