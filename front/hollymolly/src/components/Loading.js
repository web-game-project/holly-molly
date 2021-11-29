import Loader from "react-loader-spinner";

function Loading(){
    return(
           <Loader
                type="Oval"
                color="#3d66ba"
                height={50}
                width={50}
                timeout={3000}
            />
    );
}

export default Loading;