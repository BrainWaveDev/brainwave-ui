import classes from './SkeletonWrapper.module.css';
import classNames from 'classnames';

export default function LoadingWrapper({
  className = ''
}: {
  className?: string;
}) {
  return <div className={classNames(classes.wrapper, className)} />;
}
