import './tile.css';

interface Props {
  number: number;
  value: string;
  img?: string | undefined;
  team?: number | undefined;
  isSuggest?: boolean | undefined;
}

const Tile = ({ number, value, img, team, isSuggest }: Props) => {
  console.log('SS', isSuggest);
  let spanElement;
  if (number % 2 === 0) {
    spanElement = (
      <div className='tile black-tile'>
        {img && (
          <div
            id={`${team}-0`}
            style={{ backgroundImage: `url(${img})` }}
            className={isSuggest ? 'suggestion chess-piece' : 'chess-piece'}
          ></div>
        )}
        {isSuggest && (
          <div
            id={`${team}-0`}
            style={{ backgroundImage: `url(${img})` }}
            className={'suggestion chess-piece'}
          ></div>
        )}
      </div>
    );
  } else {
    spanElement = <div className='tile white-tile'>{value}</div>;
  }

  return spanElement;
};

export default Tile;
