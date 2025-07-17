import { create } from "zustand";

export const useInterviewHistoryStore = create((set) => ({
    interviews: [
        {
            _id: 1,
            topic: "Frontend Development",
            date: "2024-06-01",
            score: 85,
            status: "Passed",
            questions: [
                { q: "Can you explain in detail what React is and how it differs from other JavaScript frameworks for building user interfaces?", a: "React is a declarative, efficient, and flexible JavaScript library for building user interfaces, primarily maintained by Facebook. Unlike traditional frameworks, React uses a virtual DOM to optimize rendering and updates only the parts of the UI that change, resulting in better performance. It also encourages the use of reusable components, making code more modular and maintainable. React’s unidirectional data flow and hooks system further distinguish it from other frameworks like Angular or Vue." },
                { q: "Describe the useState hook in React and provide an example of how it can be used to manage component state.", a: "The useState hook is a fundamental React hook that allows functional components to have state variables. It returns a stateful value and a function to update it. For example, 'const [count, setCount] = useState(0);' creates a state variable 'count' initialized to 0, and 'setCount' is used to update its value. This enables dynamic, interactive UIs without needing class components." },
                { q: "What is the virtual DOM in React, and how does it improve the performance of web applications?", a: "The virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes occur, React creates a new virtual DOM tree and compares it with the previous one using a diffing algorithm. Only the changed elements are updated in the real DOM, minimizing direct DOM manipulations and significantly improving performance, especially in large-scale applications." },
                { q: "How can you pass data between React components, and what are the best practices for doing so in a large application?", a: "Data in React is typically passed from parent to child components using props. For more complex applications, state management libraries like Redux or Context API are used to share data across multiple components. Best practices include keeping state as local as possible, lifting state up when necessary, and using context or external libraries for global state to avoid prop drilling and improve maintainability." },
                { q: "What is JSX in React, and why is it preferred over regular JavaScript for defining UI components?", a: "JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows developers to write HTML-like code within JavaScript files. JSX makes it easier to visualize the UI structure, catch errors at compile time, and leverage the full power of JavaScript within markup. It is preferred because it improves code readability and developer productivity." }
            ]
        },
        {
            _id: 2,
            topic: "Backend Development",
            date: "2024-05-20",
            score: 78,
            status: "Passed",
            questions: [
                { q: "What is Node.js, and how does its event-driven architecture benefit backend development?", a: "Node.js is a runtime environment that allows JavaScript to be executed on the server side, built on Chrome's V8 engine. Its event-driven, non-blocking I/O model enables handling many simultaneous connections efficiently, making it ideal for scalable network applications. This architecture allows Node.js to process multiple requests without waiting for any single operation to complete, resulting in high throughput and responsiveness." },
                { q: "Explain the concept of RESTful APIs and how they facilitate communication between client and server in web applications.", a: "RESTful APIs (Representational State Transfer) are a set of architectural principles for designing networked applications. They use standard HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources, which are represented as URLs. RESTful APIs are stateless, scalable, and allow different clients (web, mobile) to interact with the server in a uniform way, making integration and maintenance easier." },
                { q: "What is Express.js, and what are some of its key features that make it popular for building backend services?", a: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building APIs and web applications. Key features include middleware support, routing, template engines, and easy integration with databases. Its simplicity and extensibility make it a popular choice for both small and large-scale backend services." },
                { q: "How do you typically connect a Node.js application to a database, and what are the advantages of using an ORM?", a: "Node.js applications connect to databases using drivers or Object-Relational Mappers (ORMs) like Mongoose for MongoDB or Sequelize for SQL databases. ORMs provide an abstraction layer, allowing developers to interact with the database using JavaScript objects instead of raw queries. This improves code readability, maintainability, and reduces the risk of SQL injection attacks." },
                { q: "What is middleware in Express.js, and how can it be used to enhance the functionality of a web server?", a: "Middleware in Express.js refers to functions that execute during the request-response cycle. They can modify requests and responses, handle authentication, log activity, or manage errors. Middleware enables modular and reusable code, allowing developers to add functionality to the server in a clean and organized manner." }
            ]
        },
        {
            _id: 3,
            topic: "Data Structures",
            date: "2024-04-15",
            score: 92,
            status: "Passed",
            questions: [
                { q: "What is a linked list, and how does it differ from an array in terms of memory allocation and performance?", a: "A linked list is a linear data structure where each element, called a node, contains a value and a reference (or pointer) to the next node in the sequence. Unlike arrays, linked lists do not require contiguous memory allocation, making insertions and deletions more efficient. However, they have slower access times for random elements compared to arrays, as traversal is required from the head node." },
                { q: "Explain the differences between a stack and a queue, and provide real-world examples where each would be used.", a: "A stack is a Last-In-First-Out (LIFO) data structure where elements are added and removed from the top. Common uses include function call management and undo operations. A queue is a First-In-First-Out (FIFO) structure where elements are added at the rear and removed from the front, such as in print job scheduling or task queues. Both structures are fundamental for algorithm design and resource management." },
                { q: "What is a binary tree, and what are some common operations performed on binary trees in computer science?", a: "A binary tree is a hierarchical data structure in which each node has at most two children, referred to as the left and right child. Common operations include insertion, deletion, traversal (inorder, preorder, postorder), and searching. Binary trees are used in applications like expression parsing, searching, and sorting algorithms (e.g., binary search trees, heaps)." },
                { q: "How do you traverse a graph, and what are the differences between breadth-first search (BFS) and depth-first search (DFS)?", a: "Graph traversal involves visiting all the nodes in a graph in a systematic way. BFS explores nodes level by level, using a queue, and is useful for finding the shortest path. DFS explores as far as possible along each branch before backtracking, using a stack or recursion, and is useful for tasks like topological sorting and cycle detection." },
                { q: "What is a hash table, and how does it achieve constant time complexity for search, insert, and delete operations?", a: "A hash table is a data structure that implements an associative array, mapping keys to values using a hash function. The hash function computes an index into an array of buckets, from which the desired value can be found. This allows for average-case constant time complexity for search, insert, and delete operations, making hash tables highly efficient for many applications." }
            ]
        },
        {
            _id: 4,
            topic: "System Design",
            date: "2024-03-10",
            score: 65,
            status: "Failed",
            questions: [
                { q: "What is load balancing in system design, and why is it critical for building scalable web applications?", a: "Load balancing is the process of distributing incoming network traffic across multiple servers to ensure no single server becomes overwhelmed. This improves application availability, fault tolerance, and scalability. Load balancers can use various algorithms (round robin, least connections) and can be implemented at hardware or software levels, making them essential for modern web infrastructure." },
                { q: "Explain the microservices architectural style and discuss its advantages and challenges compared to monolithic architectures.", a: "Microservices is an architectural style that structures an application as a collection of small, independent services, each responsible for a specific business capability. Advantages include improved scalability, easier deployment, and better fault isolation. Challenges include increased complexity in communication, data consistency, and deployment orchestration." },
                { q: "What is a Content Delivery Network (CDN), and how does it enhance the performance and reliability of web applications?", a: "A CDN is a geographically distributed network of servers that deliver content to users based on their location. By caching static assets closer to users, CDNs reduce latency, improve load times, and increase reliability by providing redundancy in case of server failures. They are widely used for delivering images, videos, and other static resources." },
                { q: "How do you scale a database in a large-scale system, and what are the trade-offs between sharding and replication?", a: "Scaling a database involves increasing its capacity to handle more data and traffic. Sharding splits data across multiple databases to distribute load, while replication creates copies of the same data for redundancy and faster reads. Sharding improves write scalability but adds complexity, while replication enhances availability but may introduce consistency challenges." },
                { q: "What is caching in system design, and what strategies can be used to ensure cache consistency and efficiency?", a: "Caching stores frequently accessed data in a fast storage layer to reduce latency and database load. Strategies for cache consistency include time-to-live (TTL), cache invalidation, and write-through or write-back policies. Efficient caching improves performance but requires careful management to avoid stale or inconsistent data." }
            ]
        },
        {
            _id: 5,
            topic: "DevOps",
            date: "2024-02-05",
            score: 88,
            status: "Passed",
            questions: [
                { q: "What is CI/CD in DevOps, and how does it improve the software development lifecycle?", a: "CI/CD stands for Continuous Integration and Continuous Deployment. CI involves automatically building and testing code changes, while CD automates the deployment process. This approach reduces integration issues, accelerates release cycles, and ensures higher software quality by catching bugs early and enabling rapid feedback." },
                { q: "Explain the concept of Docker containers and how they differ from traditional virtual machines.", a: "Docker is a platform that enables developers to package applications and their dependencies into containers, which are lightweight, portable, and consistent across environments. Unlike virtual machines, containers share the host OS kernel, making them more efficient and faster to start. Docker simplifies deployment, scaling, and management of applications." },
                { q: "What is Kubernetes, and what are its main components for orchestrating containerized applications?", a: "Kubernetes is an open-source platform for automating deployment, scaling, and management of containerized applications. Its main components include pods (the smallest deployable units), services (networking abstraction), deployments (managing replica sets), and nodes (worker machines). Kubernetes provides self-healing, load balancing, and automated rollouts/rollbacks." },
                { q: "How do you monitor applications in a production environment, and what tools are commonly used for this purpose?", a: "Application monitoring involves tracking performance, availability, and errors in real time. Common tools include Prometheus for metrics collection, Grafana for visualization, and New Relic or Datadog for comprehensive monitoring. Effective monitoring helps detect issues early, optimize performance, and ensure system reliability." },
                { q: "What is infrastructure as code (IaC), and what are the benefits of using tools like Terraform or CloudFormation?", a: "Infrastructure as code (IaC) is the practice of managing and provisioning computing infrastructure using machine-readable configuration files. Tools like Terraform and AWS CloudFormation enable version control, automation, and repeatability of infrastructure deployments, reducing manual errors and improving scalability and consistency across environments." }
            ]
        }
    ],
    showInterview: 1,
    setShowInterview: (id) => set({ showInterview: id }),

}))