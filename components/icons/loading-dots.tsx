// import styles from "./loading-dots.module.css";

interface LoadingDotsProps {
  color?: string;
  className?: string;
}

const LoadingDots = ({ color = "#000" }: LoadingDotsProps) => {
  return (
    <span>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};

export default LoadingDots;

// .loading {
//   display: inline-flex;
//   align-items: center;
// }

// .loading .spacer {
//   margin-right: 2px;
// }

// .loading span {
//   animation-name: blink;
//   animation-duration: 1.4s;
//   animation-iteration-count: infinite;
//   animation-fill-mode: both;
//   width: 5px;
//   height: 5px;
//   border-radius: 50%;
//   display: inline-block;
//   margin: 0 1px;
// }

// .loading span:nth-of-type(2) {
//   animation-delay: 0.2s;
// }

// .loading span:nth-of-type(3) {
//   animation-delay: 0.4s;
// }

// @keyframes blink {
//   0% {
//     opacity: 0.2;
//   }
//   20% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 0.2;
//   }
// }
