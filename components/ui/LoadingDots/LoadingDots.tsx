import classes from './LoadingDots.module.css';
import classNames from 'classnames';

const LoadingDots = () => {
  return (
    <div className={classes.root}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          className={classNames(classes.dot, classes[`dot-${i + 1}`])}
          key={i}
        />
      ))}
    </div>
  );
};

export default LoadingDots;
