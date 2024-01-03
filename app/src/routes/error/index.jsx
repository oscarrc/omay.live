import Layout from "../../components/layout";
import { useRouteError } from "react-router-dom";

const Error = () => {
    const error = useRouteError();
    
    return (
        <Layout>
            404
        </Layout>
    )
}

export default Error;