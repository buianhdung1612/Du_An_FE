import { useParams } from 'react-router-dom';
import StandardPostTemplate from '../templates/StandardPostTemplate';
import TutorialPostTemplate from '../templates/TutorialPostTemplate';

export default function SinglePost() {
    const { slug } = useParams();

    // MOCK DATA FETCHING: Normally you would fetch from an API based on slug
    const isTutorial = slug === 'typescript-deep-dive';

    const postData = {
        title: isTutorial ? 'README' : '30 Best Lifestyle Blogs to Follow in 2025',
        type: isTutorial ? 'tutorial' : 'standard',
        content: isTutorial
            ? `
[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UCGD_0i6L48hucTiiyhb5QzQ?style=social)](https://www.youtube.com/@basarat)

## TypeScript Deep Dive

Learn Professional TypeScript. I've been looking at the issues that turn up commonly when people start using TypeScript. This is based on the lessons from Stack Overflow / DefinitelyTyped and general engagement with the TypeScript community. You can follow for updates and don't forget to ★ on GitHub 🌹

### Reviews

* Thanks for the wonderful book. Learned a lot from it.
* Its probably the Best TypeScript book out there. Good Job.
* Love how precise and clear the examples and explanations are!
* For the low, low price of free, you get pages of pure awesomeness. Chock full of source code examples and clear, concise explanations, TypeScript Deep Dive will help you learn TypeScript development.
* Just a big thank you! **Best TypeScript 2 detailed explanation!**
* This gitbook got my project going pronto. Fluent easy read 5 stars.
* I recommend the online #typescript book by @basarat you'll love it.
* I've always found this by @basarat really helpful.

### Get Started

If you are here to read the book online get started.

### Code Sample

Here is a quick overview of how you might declare types cleanly:

\`\`\`typescript
interface UserProfile {
    id: string;
    email: string;
    isActive: boolean;
    lastLogin?: Date;
}

function updateProfile(user: UserProfile, newEmail: string): UserProfile {
    return {
        ...user,
        email: newEmail,
        lastLogin: new Date()
    };
}
\`\`\`

### Translations

Book is completely free so you can copy paste whatever you want without requiring permission. If you have a translation you want me to link here. Send a PR.

* Filipino
* Italian
* Chinese
* Russian
* Portuguese
`
            : `<p>Gosh jaguar ostrich...</p>`,
        slug: slug || ''
    };

    if (postData.type === 'tutorial') {
        return <TutorialPostTemplate data={postData} />;
    }

    return <StandardPostTemplate data={postData} />;
}
