import { ArrowRightIcon } from "@phosphor-icons/react";
import { PROJECTS } from "@/constants";

export default function ProjectsSection() {
  return (
    <section className="w-full ">
      <div className="container-2xl p-4 md:p-8 flex flex-col gap-4 md:gap-8">
        <h2 className="text-5xl md:text-6xl leading-[140%] font-semibold -tracking-wide">
          We are building...
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group glass-card p-6 sm:p-8 md:p-10 flex flex-col gap-4 hover:brightness-110 transition-all duration-150 ease-out border border-rock/20 hover:border-rock/30"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display tracking-[0.02em]">
                  {project.name}
                </h3>
                <ArrowRightIcon
                  weight="bold"
                  size={24}
                  className="group-hover:scale-110 origin-center group-hover:-rotate-45 transition-all duration-200 flex-shrink-0 sm:w-6 sm:h-6"
                />
              </div>
              <p className="text-lg sm:text-xl text-rock/80 flex-grow">
                {project.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
