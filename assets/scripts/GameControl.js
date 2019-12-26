

const EasyPosition = require('EasyPosition');
const EasySearch = require('EasySearch');
const NormalPosition = require('NormalPosition');
const NormalSearch = require('NormalSearch');
const HardPosition = require('HardPosition');
const HardSearch = require('HardSearch');
const ChessSize = 100;

var LIMIT_DEPTH = 64;	// 最大搜索深度

const ChessEnum = {
    RedShuai:0,
    RedShi:1,
    RedXiang:2,
    RedMa:3,
    RedChe:4,
    RedPao:5,
    RedBing:6,
    BlackJiang:7,
    BlackShi:8,
    BlackXiang:9,
    BlackMa:10,
    BlackChe:11,
    BlackPao:12,
    BlackZu:13,
};

// 棋子编号
var ChessTypeEnum = {
    Jiang:0,
    Shi:1,
    Xiang:2,
    Ma:3,
    Che:4,
    Pao:5,
    Bing:6,
};

window.ChessTypeEnum = ChessTypeEnum;

// 根据一维矩阵，获取二维矩阵行数
function RANK_Y(sq) {
    return sq >> 4;
  }
  
// 根据一维矩阵，获取二维矩阵列数
function FILE_X(sq) {
return sq & 15;
}
// 将一个走法的起点和终点，转化为一个整型数字
function MOVE(sqSrc, sqDst) {
    return sqSrc + (sqDst << 8);
}
// 获取走法的起点
function SRC(mv) {
    return mv & 255;
}
  
// 获取走法的终点
function DST(mv) {
    return mv >> 8;
}
function SQUARE_FLIP(sq) {
    return 254 - sq;
}
cc.Class({
    extends: cc.Component,

    properties: {
        MessageBoxPref:cc.Prefab,
        MainNode:cc.Node,
        GameNode:cc.Node,
        DropDownNode:{
            type:cc.Node,
            default:null,
        },
        HardLevel:{
            default:0,
            visible:false,
        },
        ChessPrefabs:[cc.Prefab],
        ChessBoard:cc.Node,
        GridPos:null,
        RedChesses:[],
        BlackChesses:[],
        _actionStatus:1,
        ActionStatus:{
            get(){
                return this._actionStatus;
            },
            set(value)
            {
                this._actionStatus = value;
            }
        },
        SelectedChess:null,
        _isRedTurn:true,
        IsRedTurn:{
            get()
            {
                return this._isRedTurn;
            },
            set(value)
            {
                this._isRedTurn = value;

                if(!value && this.pcType == 1)
                {
                    this.ComputerMove(this.pcType);
                }else if(value && this.pcType == 0)
                {
                    this.ComputerMove(this.pcType);
                }
            }
        },
        myType:0,
        pcType:1,
        GameStart:false,
        FaceKingPrefab:cc.Prefab,
        ResultPrefab:cc.Prefab,
        ResultNode:{
            default:null,
            visible:false,
        },
        StartLabel:cc.Label,
    },

    
    OnSingleGameClicked()
    {
        let moveby = cc.moveBy(1,-2000,0);//.easing(cc.easeBackInOut);
        this.MainNode.runAction(moveby);
        let moveby2 = cc.moveBy(1,-2000,0);
        this.GameNode.runAction(moveby2);
    },

    OnDoubleGameClicked()
    {
        let msg = "火热开发中，敬请期待...";
        MessageBox.show(msg, MessageBox.OK,null);
    },
    OnBackBtnClicked()
    {
        let moveby = cc.moveBy(1,2000,0);//.easing(cc.easeBackInOut);
        this.MainNode.runAction(moveby);
        let moveby2= cc.moveBy(1,2000,0);
        this.GameNode.runAction(moveby2);
    },
    start () {
        window.MessageBoxPref = this.MessageBoxPref;
        window.GameControl = this;
        this.DropDown = this.DropDownNode.getComponent('DropDown');
        this.DropDown.selectedIndex = 0;
        this.ActionStatusEnum = cc.Enum({
            None:0,
            Select:1,
            //Move:2,
        });
        
        this.ChessBoard.on(cc.Node.EventType.TOUCH_START, this.onTouchBoard, this);
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            this.DropDown.hide();
        },this)
        this.GridPos = new Array();
        for(let row=0;row<10;row++)
        {
            this.GridPos[row] = new Array();
            for(let col=0;col<9;col++)
            {
                this.GridPos[row][col] = this.calPos(row,col);
            }
        }

        this.RedJiangStandPos = [];
        this.BlackJiangStandPos = [];
        this.RedShiStandPos = [];
        this.BlackShiStandPos = [];

        this.RedJiangStandPos.push(cc.v2(0,3));
        this.RedJiangStandPos.push(cc.v2(0,4));
        this.RedJiangStandPos.push(cc.v2(0,5));
        this.RedJiangStandPos.push(cc.v2(1,3));
        this.RedJiangStandPos.push(cc.v2(1,4));
        this.RedJiangStandPos.push(cc.v2(1,5));
        this.RedJiangStandPos.push(cc.v2(2,3));
        this.RedJiangStandPos.push(cc.v2(2,4));
        this.RedJiangStandPos.push(cc.v2(2,5));

        this.BlackJiangStandPos.push(cc.v2(9,3));
        this.BlackJiangStandPos.push(cc.v2(9,4));
        this.BlackJiangStandPos.push(cc.v2(9,5));
        this.BlackJiangStandPos.push(cc.v2(8,3));
        this.BlackJiangStandPos.push(cc.v2(8,4));
        this.BlackJiangStandPos.push(cc.v2(8,5));
        this.BlackJiangStandPos.push(cc.v2(7,3));
        this.BlackJiangStandPos.push(cc.v2(7,4));
        this.BlackJiangStandPos.push(cc.v2(7,5));

        this.RedShiStandPos.push(cc.v2(1,4));
        this.RedShiStandPos.push(cc.v2(0,3));
        this.RedShiStandPos.push(cc.v2(0,5));
        this.RedShiStandPos.push(cc.v2(2,3));
        this.RedShiStandPos.push(cc.v2(2,5));

        this.BlackShiStandPos.push(cc.v2(8,4));
        this.BlackShiStandPos.push(cc.v2(9,3));
        this.BlackShiStandPos.push(cc.v2(9,5));
        this.BlackShiStandPos.push(cc.v2(7,3));
        this.BlackShiStandPos.push(cc.v2(7,5));

        //this.StartGame();
    },
    StartGame()
    {
        this.HardLevel=this.DropDown.selectedIndex;
        if(this.HardLevel == 0)
        {
            this.pos = new EasyPosition();
            this.search = new EasySearch(this.pos);
        }else if(this.HardLevel == 1)
        {
            this.pos = new NormalPosition();
            this.search = new NormalSearch(this.pos);
        }else if(this.HardLevel == 2)
        {
            this.pos = new HardPosition();
            this.search = new HardSearch(this.pos);
        }
        
        this.ActionStatus = this.ActionStatusEnum.None;
        this.pos.fromFen("rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1");	// 根据FEN串初始化棋局
        
        if(this.ResultNode != null)
        {
            this.ResultNode.destroy();
            this.ResultNode = null;
        }
        if(this.RedChesses != null && this.RedChesses.length !=0)
        {
            this.RedChesses.forEach(item=>{
                item.node.destroy();
            });
        }
        if(this.BlackChesses != null && this.BlackChesses.length !=0)
        {
            this.BlackChesses.forEach(item=>{
                item.node.destroy();
            });
        }
        this.RedChesses = [];
        this.BlackChesses = [];    
        
        this.MoveBackList = [];

        //创建一个红帅
        let chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedShuai]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[0][4];
        let chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[0][4];
        chessMan.RowColPos = cc.v2(0,4);
        this.RedChesses.push(chessMan);
        //创建两个红士
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedShi]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[0][3];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[0][3];
        chessMan.RowColPos = cc.v2(0,3);
        this.RedChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedShi]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[0][5];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[0][5];
        chessMan.RowColPos = cc.v2(0,5);
        this.RedChesses.push(chessMan);
        //创建两个红相
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedXiang]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[0][2];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[0][2];
        chessMan.RowColPos = cc.v2(0,2);
        this.RedChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedXiang]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[0][6];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[0][6];
        chessMan.RowColPos = cc.v2(0,6);
        this.RedChesses.push(chessMan);
        //创建两个红马
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedMa]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[0][1];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[0][1];
        chessMan.RowColPos = cc.v2(0,1);
        this.RedChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedMa]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[0][7];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[0][7];
        chessMan.RowColPos = cc.v2(0,7);
        this.RedChesses.push(chessMan);
        //创建两个红车
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedChe]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[0][0];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[0][0];
        chessMan.RowColPos = cc.v2(0,0);
        this.RedChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedChe]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[0][8];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[0][8];
        chessMan.RowColPos = cc.v2(0,8);
        this.RedChesses.push(chessMan);
        //创建两个红跑
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedPao]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[2][1];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[2][1];
        chessMan.RowColPos = cc.v2(2,1);
        this.RedChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedPao]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[2][7];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[2][7];
        chessMan.RowColPos = cc.v2(2,7);
        this.RedChesses.push(chessMan);
        //创建五个红兵
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedBing]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[3][0];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[3][0];
        chessMan.RowColPos = cc.v2(3,0);
        this.RedChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedBing]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[3][2];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[3][2];
        chessMan.RowColPos = cc.v2(3,2);
        this.RedChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedBing]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[3][4];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[3][4];
        chessMan.RowColPos = cc.v2(3,4);
        this.RedChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedBing]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[3][6];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[3][6];
        chessMan.RowColPos = cc.v2(3,6);
        this.RedChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.RedBing]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[3][8];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[3][8];
        chessMan.RowColPos = cc.v2(3,8);
        this.RedChesses.push(chessMan);
        ////////////////////////////////////////////
        //创建一个黑将
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackJiang]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[9][4];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[9][4];
        chessMan.RowColPos = cc.v2(9,4);
        this.BlackChesses.push(chessMan);
        //创建两个黑士
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackShi]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[9][3];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[9][3];
        chessMan.RowColPos = cc.v2(9,3);
        this.BlackChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackShi]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[9][5];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[9][5];
        chessMan.RowColPos = cc.v2(9,5);
        this.BlackChesses.push(chessMan);
        //创建两个黑象
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackXiang]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[9][2];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[9][2];
        chessMan.RowColPos = cc.v2(9,2);
        this.BlackChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackXiang]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[9][6];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[9][6];
        chessMan.RowColPos = cc.v2(9,6);
        this.BlackChesses.push(chessMan);
        //创建两个黑马
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackMa]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[9][1];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[9][1];
        chessMan.RowColPos = cc.v2(9,1);
        this.BlackChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackMa]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[9][7];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[9][7];
        chessMan.RowColPos = cc.v2(9,7);
        this.BlackChesses.push(chessMan);
        //创建两个黑车
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackChe]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[9][0];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[9][0];
        chessMan.RowColPos = cc.v2(9,0);
        this.BlackChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackChe]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[9][8];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[9][8];
        chessMan.RowColPos = cc.v2(9,8);
        this.BlackChesses.push(chessMan);
        //创建两个黑跑
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackPao]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[7][1];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[7][1];
        chessMan.RowColPos = cc.v2(7,1);
        this.BlackChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackPao]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[7][7];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[7][7];
        chessMan.RowColPos = cc.v2(7,7);
        this.BlackChesses.push(chessMan);
        //创建五个黑卒
        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackZu]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[6][0];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[6][0];
        chessMan.RowColPos = cc.v2(6,0);
        this.BlackChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackZu]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[6][2];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[6][2];
        chessMan.RowColPos = cc.v2(6,2);
        this.BlackChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackZu]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[6][4];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[6][4];
        chessMan.RowColPos = cc.v2(6,4);
        this.BlackChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackZu]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[6][6];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[6][6];
        chessMan.RowColPos = cc.v2(6,6);
        this.BlackChesses.push(chessMan);

        chessInstance = cc.instantiate(this.ChessPrefabs[ChessEnum.BlackZu]);
        chessInstance.parent = this.ChessBoard;
        chessInstance.position = this.GridPos[6][8];
        chessMan = chessInstance.getComponent('Chessman');
        chessMan.Pos = this.GridPos[6][8];
        chessMan.RowColPos = cc.v2(6,8);
        this.BlackChesses.push(chessMan);

        this.RedChesses.forEach(chess=>{
            chess.node.scale = cc.v2(0.9,0.9);
        });
        this.BlackChesses.forEach(chess=>{
            chess.node.scale = cc.v2(0.9,0.9);
        });
        this.GameStart = true;
        this.IsRedTurn = true;
        this.myType = 0;//我是红方，电脑是黑方
        this.StartLabel.string = "重新开始";
    },
    calPos(row,col)
    {
        let xPos = (col - 4)  * ChessSize;
        let yPos = (row - 4)  * ChessSize - ChessSize / 2 ;
        return cc.v2(xPos,yPos);
    },
    //点击棋盘上没有被棋子占的位置
    onTouchBoard(event){
        if(this.ActionStatus != this.ActionStatusEnum.Select)
        {
            return;
        }
        let pos = this.ChessBoard.convertToNodeSpaceAR(event.getLocation());
  
        let point = this.GetPointByPosition(pos);
        //走一步棋，移动到空白位置
        if(point != null && this.SelectedChess != null
            && this.SelectedChess.CanMove(point))
        {
            //先检查走这步棋之后是不是送将，是的话则不能走这步棋
            let pt = this.SelectedChess.RowColPos;
            this.SelectedChess.RowColPos = point;
            if(this.CheckJiang(true))
            {
                this.SelectedChess.RowColPos = pt;
                return;
            }
            this.SelectedChess.RowColPos = pt;
            let pointPos = this.GetPosition(pos);
            this.MoveTo(pointPos,point);
        }
    },
    GetPosition(pos)
    {
        let position = null;
        for(let row=0;row<10;row++)
        {
            for(let col=0;col<9;col++)
            {
                let gridPos = this.GridPos[row][col];
                let x2 = Math.pow(Math.abs(gridPos.x - pos.x),2);
                let y2 = Math.pow(Math.abs(gridPos.y - pos.y),2);
                let r = Math.sqrt(x2 + y2);
                if(r <= ChessSize/2)
                {
                    position = gridPos;
                    break;
                }
            }
        }
        return position;
    },
    getPositionByPoint(point)
    {
        return this.GridPos[point.x][point.y];
    },
    GetPointByPosition(pos)
    {
        let point = null;
        for(let row=0;row<10;row++)
        {
            for(let col=0;col<9;col++)
            {
                let gridPos = this.GridPos[row][col];
                let x2 = Math.pow(Math.abs(gridPos.x - pos.x),2);
                let y2 = Math.pow(Math.abs(gridPos.y - pos.y),2);
                let r = Math.sqrt(x2 + y2);
                if(r <= ChessSize/2)
                {
                    point = cc.v2(row,col);
                    break;
                }
            }
        }
        return point;
    },
    

    MoveTo(pointPos,rowCol)
    {
        let time = this.SelectedChess.MoveTo(pointPos);
        
        //记录走棋信息用于悔棋
        let moveBackInfo = {};
        moveBackInfo.chess = this.SelectedChess;
        moveBackInfo.fromPoint = this.SelectedChess.RowColPos;
        moveBackInfo.toPoint = rowCol;
        moveBackInfo.eatChess = null;
        this.MoveBackList.push(moveBackInfo);


        let fromSq = this.PointToSquare(this.SelectedChess.RowColPos);
        let toSq = this.PointToSquare(rowCol);
        this.pos.makeMove(MOVE(fromSq, toSq));

        this.SelectedChess.RowColPos = rowCol;
        this.SelectedChess.IsSelected = false;
        this.SelectedChess = null;
        
        if(this.CheckMate())
        {
            return;
        }

        //this.lastMoveTime = (new Date()).valueOf();
        this.scheduleOnce(()=>{
            //移动之后检查是否能将军
            this.CheckJiang();

             //此时才把状态置为NONE，修复连续点击棋子造成bug
            this.ActionStatus = this.ActionStatusEnum.None;
            //此时才让对方走棋
            this.IsRedTurn = !this.IsRedTurn;
        },time);
    },
    CheckMate()
    {
        if(this.pos.isMate())
        {
            this.GameStart = false;
            let node = cc.instantiate(this.ResultPrefab);
            node.parent = this.node;
            let result = 0;
            if(this.IsRedTurn)
            {
                result = 0;
            }else
            {
                result = 1;
            }
            node.getComponent('WinOrLose').SetData(result);
            this.ResultNode = node;
            return true;
        }
        return false;
    },
    PointToSquare(point)
    {
        return (12 - point.x)*16 + point.y+3;
    },
    // addMove(mv, computerMove)
    // {
    //     // 判断这步棋是否合法
    //     // if (!this.pos.legalMove(mv)) {
    //     //     return;
    //     // }
        
    //     // 执行这步棋
    //     if (!this.pos.makeMove(mv)) {
    //         return;
    //     }
        
    //     //this.postAddMove(mv, computerMove);
    // },
    
    Eat(chess)
    {
        let time = this.SelectedChess.MoveTo(chess.Pos);

        //记录走棋信息用于悔棋
        let moveBackInfo = {};
        moveBackInfo.chess = this.SelectedChess;
        moveBackInfo.fromPoint = this.SelectedChess.RowColPos;
        moveBackInfo.toPoint = chess.rowCol;
        moveBackInfo.eatChess = chess;
        this.MoveBackList.push(moveBackInfo);

        let fromSq = this.PointToSquare(this.SelectedChess.RowColPos);
        let toSq = this.PointToSquare(chess.RowColPos);
        this.pos.makeMove(MOVE(fromSq, toSq));

        this.SelectedChess.RowColPos = chess.RowColPos;
        this.SelectedChess.IsSelected = false;
        this.SelectedChess = null;

        this.scheduleOnce(()=>{
            if(chess.Type == 0)
            {
                chess.node.active = false;
                this.RedChesses.delete(chess);
            }else if(chess.Type == 1)
            {
                chess.node.active = false;
                this.BlackChesses.delete(chess);
            } 
            //吃掉老将，结束
            if(this.CheckMate())
            {
                return;
            }
            //吃子之后检查是否能将军
             this.CheckJiang();

            //此时才把状态置为NONE，修复连续点击棋子造成bug
            this.ActionStatus = this.ActionStatusEnum.None;
            //此时才让对方走棋
            this.IsRedTurn = !this.IsRedTurn;
        },time);
    },
    CheckJiang(IsCheckMe = false)
    {
        if(this.IsRedTurn)
        {
            let chesses = IsCheckMe ? this.BlackChesses : this.RedChesses;
            for(let i=0;i<chesses.length;i++)
            {
                let chess = chesses[i];
                if(chess.CheckJiang())
                {
                    if(!IsCheckMe)
                    {
                        this.FaceKingWarning();
                        break;
                    }
                    else{
                        return true;
                    }
                }
            }
        }else{
            let chesses = IsCheckMe ? this.RedChesses : this.BlackChesses;
            for(let i=0;i<chesses.length;i++)
            {
                let chess = chesses[i];
                if(chess.CheckJiang())
                {
                    if(!IsCheckMe)
                    {
                        this.FaceKingWarning();
                        break;
                    }
                    else{
                        return true;
                    }
                }
            }
        }
    },
    
    FaceKingWarning()
    {
        let node = cc.instantiate(this.FaceKingPrefab);
        node.parent = this.node;
        node.scale = cc.v2(0,0);
        node.runAction(cc.scaleTo(0.5, 1,1));
    },
    
    // 生成棋局的所有走法
    generateMoves(type)
    {
        let movies = [];
        let myAllChesses = type == 0 ? this.RedChesses : this.BlackChesses;
        for(let i=0;i<myAllChesses.length;i++)
        {
            let chess = myAllChesses[i];
            let mvs = chess.getAllMoves();
            movies = movies.concat(mvs);
        }
        return movies;
    },
    searchMain(type) {
        // 生成当前局面所有走法
        var mvs = this.generateMoves(type);
        
        // 随机选择一个走法，并返回
        var randNum = parseInt(Math.random()*mvs.length);
        return mvs[randNum];
    },
    GetPointFromMoveInfo(mv,isSrc=true)
    {
        let sq = isSrc ? SRC(mv) : DST(mv);
        //sq = SQUARE_FLIP(sq);
        let row = 15 - RANK_Y(sq) -3;
        let column = FILE_X(sq) - 3;

        let point = cc.v2(row, column);
        return point;
    },
    ComputerMove()
    {
        if(!this.GameStart)
        {
            return;
        }
        let mv = this.search.searchMain(LIMIT_DEPTH,1000);
        let fromPoint = this.GetPointFromMoveInfo(mv,true);
        let toPoint = this.GetPointFromMoveInfo(mv,false);
        
        for(let i=0;i<this.BlackChesses.length;i++)
        {
            let selectedChess = this.BlackChesses[i];
            if(selectedChess.IsVecEqual(fromPoint, selectedChess.RowColPos))
            {
                selectedChess.OnSelectClick();
                for(let j=0;j<this.RedChesses.length;j++)
                {
                    let enimyChess = this.RedChesses[j];
                    if(enimyChess.IsVecEqual(toPoint,enimyChess.RowColPos))
                    {
                        //目标点上有敌方的棋子，则吃掉
                        this.Eat(enimyChess);
                        return;
                    }
                }
                //目标点上没有棋子，则移动到目标点
                let position = this.getPositionByPoint(toPoint);
                this.MoveTo(position,toPoint);
                return;
            }
        }

        return;

        let chess = mv.chess;
        let point = mv.toPos;
        //电脑模拟选棋
        chess.OnSelectClick();
        let pt = this.SelectedChess.RowColPos;
        this.SelectedChess.RowColPos = point;
        //电脑走棋
        if(chess.Type == 0)
        {
            
            for(let i=0;i<this.BlackChesses.length;i++)
            {
                let enimyChess = this.BlackChesses[i];
                //目标点上有敌方的棋子，吃掉
                if(chess.IsVecEqual(point, enimyChess.RowColPos))
                {
                    //先判断走这步棋是不是送将，是的话重新选一步棋
                    if(this.CheckJiang(true))
                    {
                        this.SelectedChess.RowColPos = pt;
                        this.ComputerMove();
                        return;
                    }
                    this.SelectedChess.RowColPos = pt;
                    this.Eat(enimyChess);
                    return;
                }
            }
            //目标点没有棋子，走到目标点
            //先判断走这步棋是不是送将，是的话重新选一步棋
            if(this.CheckJiang(true))
            {
                this.SelectedChess.RowColPos = pt;
                this.ComputerMove();
                return;
            }
            this.SelectedChess.RowColPos = pt;
            let position = this.getPositionByPoint(point);
            this.MoveTo(position,point);
        }
        else if(chess.Type == 1)
        {
            for(let i=0;i<this.RedChesses.length;i++)
            {
                let enimyChess = this.RedChesses[i];
                if(chess.IsVecEqual(point, enimyChess.RowColPos))
                {
                    //先判断走这步棋是不是送将，是的话重新选一步棋
                    //先判断走这步棋是不是送将，是的话重新选一步棋
                    if(this.CheckJiang(true))
                    {
                        this.SelectedChess.RowColPos = pt;
                        this.ComputerMove();
                        return;
                    }
                    this.SelectedChess.RowColPos = pt;
                    this.Eat(enimyChess);
                    return;
                }
            }
            //先判断走这步棋是不是送将，是的话重新选一步棋
            //先判断走这步棋是不是送将，是的话重新选一步棋
            if(this.CheckJiang(true))
            {
                this.SelectedChess.RowColPos = pt;
                this.ComputerMove();
                return;
            }
            this.SelectedChess.RowColPos = pt;
            let position = this.getPositionByPoint(point);
            this.MoveTo(position,point);
        }
    },
    
    OnUndoMoveBtnClicked()
    {
        if(!this.IsRedTurn)
        {
            return;
        }
        this.UndoMoveBack();
        this.UndoMoveBack();
    },
    UndoMoveBack()
    {
        if(this.MoveBackList.length == 0)
        {
            return;
        }
        let mb = this.MoveBackList.pop();
        let position = this.getPositionByPoint(mb.fromPoint);
        mb.chess.MoveTo(position);
        mb.chess.RowColPos = mb.fromPoint;
        if(mb.eatChess!=null)
        {
            if(mb.eatChess.Type == 0)
            {
                mb.eatChess.node.active = true;
                this.RedChesses.push(mb.eatChess);
            }
            else if(mb.eatChess.Type == 1)
            {
                mb.eatChess.node.active = true;
                this.BlackChesses.push(mb.eatChess);
            }
        }
        if(this.SelectedChess != null)
        {
            this.SelectedChess.IsSelected = false;
            this.SelectedChess = null;
        }
        this.pos.undoMakeMove();
    }
});
