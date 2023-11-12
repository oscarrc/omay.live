import { BRAND } from "../../constants/strings";

const Landing = () => {
    return (
        <section className="flex-1 w-full bg-base-100 rounded shadow-inner p-8">
            <h1>Welcome to { BRAND }: Where Connections Come to Life!</h1>
            <p>Embark on a journey of serendipitous conversations with { BRAND }, the premier random video chat app designed to bring people from all walks of life together in a fun and engaging way. In a world that's constantly buzzing with digital noise, { BRAND } stands out as your passport to genuine connections and spontaneous interactions.</p>
            <h2>What makes { BRAND } great?</h2>
            <p>At { BRAND }, we understand the power of unplanned encounters. Our platform seamlessly connects you with individuals from around the globe, offering a refreshing break from scripted conversations and predictable social networks. Here's why { BRAND } is your go-to destination for authentic connections:</p>
            <ol>
                <li>Serendipity Unleashed: Embrace the beauty of chance encounters as { BRAND } randomly pairs you with interesting people who share your zest for spontaneous conversations.</li>
                <li>Diverse Conversations: Whether you're seeking stimulating discussions, friendly banter, or cultural exchanges, { BRAND } opens the door to a world of diverse conversations. Connect with people you might never have met otherwise.</li>
                <li>User-Friendly Interface: Our intuitive and user-friendly interface makes navigation a breeze, ensuring that you can focus on what matters most—building meaningful connections without any unnecessary hassle.</li>
                <li>Safety First: Your safety is our priority. { BRAND } employs advanced moderation tools to create a secure and respectful environment for everyone. Enjoy your conversations with peace of mind.</li>
                <li>Anonymity with Respect: Express yourself freely without sacrificing your privacy. { BRAND } values the importance of anonymous interactions, allowing you to be yourself without judgment.</li>
            </ol>
            <p>Join us at { BRAND } and redefine the way you connect with the world. Unleash the power of spontaneous conversations and forge friendships that transcend borders. Your next meaningful encounter is just a click away!</p>
        </section>
    )
}

export default Landing;