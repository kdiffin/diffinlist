import React from "react";
import { SectionCardNew, SectionNew } from "~/components/SectionNew";

function test() {
  return (
    <div>
      <SectionNew loading={true} name="song ">
        <SectionCardNew
          isAuthor={true}
          isSignedIn={true}
          data={{ pictureUrl: "", title: "pla" }}
          type="playlist"
          href={`/test`}
        />
      </SectionNew>
    </div>
  );
}

export default test;
