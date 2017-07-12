// @flow
import React from 'react';
import { CreateMapContainer, CreatePanelContainer } from 'containers';

type Props = {
    roadId: string;
    router: Object;
}

export default function CreateProposal ({roadId, router}: Props) {
    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <CreateMapContainer roadId={roadId} />
            <CreatePanelContainer roadId={roadId} router={router}/>
        </div>
    );
}
