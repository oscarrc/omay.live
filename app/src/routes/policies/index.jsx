import { Suspense, lazy } from 'react';

import { MDXProvider } from '@mdx-js/react'
import { useParams } from "react-router-dom";

const Policies = () => {
    const { id } = useParams();
    const Policy = lazy(() => import(`./policy_${id}.mdx`));

    return ( 
        <MDXProvider>
            <Suspense>
                <section dir="ltr" className="prose mx-auto max-w-full p-8 sm:rounded-lg shadow-inner bg-base-100">
                    <Policy />
                </section>
            </Suspense>
        </MDXProvider>
    )
}

export default Policies;