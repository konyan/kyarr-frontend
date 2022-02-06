import React, { useEffect, useRef, useState } from 'react';
import './board.css';
import Tile from '../Tile/tile';
import Referee from '../../service/Referee';

const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
}

interface Suggestion {
  x: number;
  y: number;
  team: TeamType;
  type: PieceType;
}

export enum TeamType {
  WHITE,
  BLACK,
}

export enum PieceType {
  PAWN,
  BISHOP,
}

let rowColumn: Array<JSX.Element> = [];
let myPieces: Piece[] = [];
for (let j = verticalAxis.length - 1; j >= 0; j--) {
  for (let i = 0; i < horizontalAxis.length; i++) {
    const number = i + j + 2;
    const value = verticalAxis[j] + horizontalAxis[i];
    let image = undefined;
    let team;

    if (j <= 2 && number % 2 === 0) {
      myPieces.push({
        image: 'assets/images/black_pawn.png',
        x: i,
        y: j,
        type: PieceType.PAWN,
        team: TeamType.BLACK,
      });
      image = 'assets/images/black_pawn.png';
      team = TeamType.BLACK;
    } else if (j >= 5 && number % 2 === 0) {
      myPieces.push({
        image: 'assets/images/white_pawn.png',
        x: i,
        y: j,
        type: PieceType.PAWN,
        team: TeamType.WHITE,
      });
      image = 'assets/images/white_pawn.png';
      team = TeamType.WHITE;
    }
    rowColumn.push(
      <Tile number={number} value={value} img={image} key={value} team={team} />
    );
  }
}

export const Board = () => {
  const [board, setBoard] = useState<any[]>([...rowColumn]);
  const [activePiece, setActivePiece] = useState<HTMLElement | null>();
  const boardRef = useRef<HTMLDivElement>(null);
  const [grabX, setGrabX] = useState<number>(0);
  const [grabY, setGrabY] = useState<number>(0);
  const [suggestion, setSuggestion] = useState<Suggestion[]>([]);

  let [pieces, setPieces] = useState<Piece[]>([...myPieces]);

  const referee = new Referee();

  useEffect(() => {
    let tiles = [];
    for (let j = verticalAxis.length - 1; j >= 0; j--) {
      for (let i = 0; i < horizontalAxis.length; i++) {
        const number = i + j + 2;
        const value = verticalAxis[j] + horizontalAxis[i];
        let image = undefined;
        let team = undefined;

        pieces.forEach((p) => {
          if (p.x === i && p.y === j) {
            image = p.image;
            team = p.team;
          }
        });

        tiles.push(
          <Tile
            number={number}
            value={value}
            img={image}
            key={value}
            team={team}
          />
        );
      }
    }
    setBoard(tiles);
  }, [pieces]);

  useEffect(() => {
    if (suggestion.length > 0) {
      let tiles = [];

      for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
          const number = i + j + 2;
          const value = verticalAxis[j] + horizontalAxis[i];
          let suggest = false;
          let image = undefined;
          let team = undefined;

          pieces.forEach((p) => {
            if (p.x === i && p.y === j) {
              image = p.image;
              team = p.team;
            }
          });
          suggestion.forEach((s) => {
            if (s.x === i && s.y === j) {
              console.log('HI', s);
              suggest = true;
            }
          });

          tiles.push(
            <Tile
              number={number}
              value={value}
              img={image}
              key={value}
              team={team}
              isSuggest={suggest}
            />
          );
        }
      }
      setBoard(tiles);
    }
  }, [pieces, suggestion]);

  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const team = parseInt(element.id.split('-')[0]);
    const type = parseInt(element.id.split('-')[1]);

    const chessBoard = boardRef.current;
    console.log('ELEMENT', element.id);
    if (element.classList.contains('chess-piece') && chessBoard) {
      const gX = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
      setGrabX(gX);
      const gY = Math.abs(
        Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100)
      );
      setGrabY(gY);

      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      setActivePiece(element);

      if (type === PieceType.PAWN) {
        if (team === TeamType.BLACK) {
          let leftMove = { x: gX - 1, y: gY + 1, team: team, type: type };
          let rightMove = {
            x: gX + 1,
            y: gY + 1,
            team: team,
            type: type,
          };
          setSuggestion([leftMove, rightMove]);
        } else {
          let leftMove = { x: gX - 1, y: gY - 1, team: team, type: type };
          let rightMove = { x: gX + 1, y: gY - 1, team: team, type: type };
          setSuggestion([leftMove, rightMove]);
        }
      } else {
      }
    }
  };

  const movePiece = (e: React.MouseEvent) => {
    const chessBoard = boardRef.current;
    if (activePiece && chessBoard) {
      const minX = chessBoard?.offsetLeft - 25;
      const minY = chessBoard?.offsetTop - 25;

      const maxX = chessBoard?.offsetLeft + chessBoard?.offsetWidth - 100;
      const maxY = chessBoard?.offsetTop + chessBoard?.offsetHeight - 100;

      const x = e.clientX - 50;
      const y = e.clientY - 50;

      activePiece.style.position = 'absolute';
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  };

  const dropPiece = (e: React.MouseEvent) => {
    console.log('I AM DROP');
    const chessBoard = boardRef.current;

    if (activePiece && chessBoard) {
      const x = Math.floor((e.clientX - chessBoard.offsetLeft) / 100);
      const y = Math.abs(
        Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100)
      );

      if (referee.sameBlock(grabX, grabY, x, y)) {
        // NO MOVE // RESET PIECE MOVE
        activePiece.style.position = 'relative';
        activePiece.style.removeProperty('left');
        activePiece.style.removeProperty('top');
      } else {
        setPieces((values: Piece[]) => {
          const pieces: Piece[] = values.map((p) => {
            if (p.x === grabX && p.y === grabY) {
              referee.invalidMove(grabX, grabY, x, y, p.type, p.team);

              // CHECKING INVALID LINE
              if (referee.invalidLine(x, y)) {
                //check out of the line;
                if (referee.invalidMove(grabX, grabY, x, y, p.type, p.team)) {
                  p.x = x;
                  p.y = y;
                } else {
                  activePiece.style.position = 'relative';
                  activePiece.style.removeProperty('left');
                  activePiece.style.removeProperty('top');
                }
              } else {
                activePiece.style.position = 'relative';
                activePiece.style.removeProperty('left');
                activePiece.style.removeProperty('top');
              }
            }
            return p;
          });
          return pieces;
        });
      }
      setActivePiece(null);
      setSuggestion([]);
    }
  };

  return (
    <div
      id='board'
      ref={boardRef}
      onMouseDown={grabPiece}
      onMouseMove={movePiece}
      onMouseUp={dropPiece}
    >
      {board}
    </div>
  );
};
