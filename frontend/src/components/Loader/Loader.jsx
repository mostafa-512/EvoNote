import styles from './Loader.module.css';
 function Loader(){
    return(
        <>
        <div className={styles.LoaderWrapper}>
            <div className={styles.Loader} />
        </div>
        </>
    );
};
export default Loader;