import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Team1Props {
  heading?: string;
  subheading?: string;
  description?: string;
  members?: TeamMember[];
}

const Team1 = ({
  heading = "Meet our team",
  subheading = "Group 8 Team Members",
  description = "This is the team that worked on the project. We combined efforts in different areas to achieve the best results. We are a team of engineers, designers, and developers who are passionate about technology and innovation.",
  members = [
    {
      id: "person-1",
      name: "Chris",
      role: "Control Systems Design and Analysis",
      avatar: "https://shadcnblocks.com/images/block/avatar-1.webp",
    },
    {
      id: "person-2",
      name: "Barnabas",
      role: "Software Design || documentation",
      avatar: "https://shadcnblocks.com/images/block/avatar-2.webp",
    },
    {
      id: "person-3",
      name: "Faith",
      role: "⁠IoT App and Web Interface Design",
      avatar: "https://shadcnblocks.com/images/block/avatar-3.webp",
    },
    {
      id: "person-4",
      name: "Abdulrauf",
      role: "Control Systems Design and Analysis ",
      avatar: "https://shadcnblocks.com/images/block/avatar-4.webp",
    },
    {
      id: "person-5",
      name: "Alfred",
      role: "Hardware Design and Analysis",
      avatar: "https://shadcnblocks.com/images/block/avatar-5.webp",
    },
    {
      id: "person-6",
      name: "Nadim",
      role: "Documentation and Slides",
      avatar: "https://shadcnblocks.com/images/block/avatar-6.webp",
    },
    {
      id: "person-7",
      name: "Blessed",
      role: "Hardware Design and Analysis",
      avatar: "https://shadcnblocks.com/images/block/avatar-7.webp",
    },
    {
      id: "person-8",
      name: "Marcel",
      role: "Hardware Design and Analysis",
      avatar: "https://shadcnblocks.com/images/block/avatar-8.webp",
    },
    {
      id: "person-9",
      name: "Alibaba",
      role: "Hardware Design and Analysis",
      avatar: "https://shadcnblocks.com/images/block/avatar-8.webp",
    },
    {
      id: "person-10",
      name: "Hassan",
      role: "IoT App and Web Interface Design",
      avatar: "https://shadcnblocks.com/images/block/avatar-8.webp",
    },
    {
      id: "person-11",
      name: "Tahiru",
      role: "IoT App and Web Interface Design",
      avatar: "https://shadcnblocks.com/images/block/avatar-8.webp",
    },
  ],
}: Team1Props) => {
  return (
    <section className="py-32">
      <div className="container flex flex-col items-center text-center">
        <p className="semibold">{subheading}</p>
        <h2 className="my-6 text-2xl font-bold text-pretty lg:text-4xl">
          {heading}
        </h2>
        <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">
          {description}
        </p>
      </div>
      <div className="container mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
        {members.map((person) => (
          <div key={person.id} className="flex flex-col items-center">
            <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
              <AvatarImage src={person.avatar} />
              <AvatarFallback>{person.name}</AvatarFallback>
            </Avatar>
            <p className="text-center font-medium">{person.name}</p>
            <p className="text-center text-muted-foreground">{person.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team1;
