import "./ButtonContainer.scss";

export const ButtonContainer = props => {
    return (
        <div className="button-container">
            {props.children}
        </div>
    );
}