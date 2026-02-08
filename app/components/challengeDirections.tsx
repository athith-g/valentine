type ChallengeDirectionsProps = {
    text: string[];
    buttonText: string;
    onButtonClick: () => void;
}

export default function ChallengeDirections({ text, buttonText, onButtonClick }: ChallengeDirectionsProps) {
    return (
    <div className="challenge-directions-container bg-dark fade-in">
      {text.map((t, index) => (
        <div key={index} className="challenge-directions-text">{t}</div>
      ))}
      <div className="challenge-directions-signature">
        <p className="challenge-directions-text"> - Evil Smiski</p>
      </div>
      <button className="challenge-directions-button challenge-button" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
}