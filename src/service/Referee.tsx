import { PieceType, TeamType } from '../components/Board/board';

export default class Referee {
  invalidMove(
    px: number,
    py: number,
    cx: number,
    cy: number,
    type: PieceType,
    team: TeamType
  ) {
    console.log('Checking move ....');

    console.log('CURRENT LOCATION', cx, cy);
    console.log('PREV LOCATION', px, py);
    console.log('PIECE TYPE', type);

    if (type === PieceType.PAWN) {
      if (team === TeamType.WHITE) {
        let leftMove = { x: px - 1, y: py - 1 };
        let rightMove = { x: px + 1, y: py - 1 };
        if (
          (leftMove.x === cx && leftMove.y === cy) ||
          (rightMove.x === cx && rightMove.y === cy)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        let leftMove = { x: px - 1, y: py + 1 };
        let rightMove = { x: px + 1, y: py + 1 };
        if (
          (leftMove.x === cx && leftMove.y === cy) ||
          (rightMove.x === cx && rightMove.y === cy)
        ) {
          return true;
        } else {
          return false;
        }
      }
    }

    return true;
  }

  invalidLine(cx: number, cy: number) {
    const number = cx + cy;
    if (number % 2 === 0) return true;
  }

  sameBlock(px: number, py: number, cx: number, cy: number) {
    return px === cx && py === cy;
  }

  suggestionMove(x: number, y: number) {
    let leftMove = { x: x - 1, y: y - 1 };
    let rightMove = { x: x + 1, y: y - 1 };

    /*  if (type === PieceType.PAWN) {
      if (team === TeamType.WHITE) {
      } else {
      }
    } else {
    } */
  }
}
