import React from "react";
import { MainFrame, MainContent } from "@/components/frame";
import ActorNav from "../ActorNav"

const ActorForm = () => {
    return (
        <MainFrame>
            <ActorNav />
            <MainContent>
                <h1>Create Actor</h1>
            </MainContent>
        </MainFrame>
    );
}

export default ActorForm;