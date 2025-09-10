# FE React-Typescript Code Convention

1. React Component
	
	Correct used :white_check_mark:
	```
	const TodoItem = () => {
	...
	}
	or
	function TodoItem(){
	...
	}
	```
	 Avoid :x:
	```
	const todoItem = () => {
	...
	}
	```

2. Typescript Interface
		
	Correct used :white_check_mark:
	```
	interface TodoItem {
		id: number;
		code: string;
		name: string;
		description: string;
	}
	```
	Avoid :x:
	```
	interface todoItem {
		id: number;
		code: string;
		name: string;
		des: string;
	}
	```
3. Typescript type alias
	
	Correct used :white_check_mark: 

	`type TodoList = TodoItem[];`

	Avoid :x:

	`type todoList = TodoItem[];`
4.	Files name

	Name your files using PascalCase, matching the component name. For example, if you have a component named TodoItem, the file should be named TodoIteM.tsx

	Correct used :white_check_mark:

	```TodoItem.tsx```

	Avoid :x:

	`todoItem.tsx`,`Todo-Item.tsx`,`Todo_Item.tsx`

5.	Props
	
	Use descriptive names for props to clearly indicate their purpose. Avoid abbreviations or acronyms unless they are widely understood in the context of your project.

	Correct used :white_check_mark:
	```
	interface AppUserProps {
		id: number;
		code: string;
		name: string;
		description: string;
	}
	const AppUserView : React.FC<AppUserProps> = (props) => {
		const { id, code, name, description } = props;
	}
	```
	Avoid :x:
	```
	interface AUserProps {
		id: number;
		code: string;
		name: string;
		des: string;
	}
	const AppUserView : React.FC<AppUserProps> = (props) => {
		const { id, code, name, des} = props;
	}
	```
6.	 State variables

		a. Boolean
			
		Prefix state variables with **is**, **has**, or 				**should** to denote boolean values.

		Correct used :white_check_mark:

		```
		const [isActive,setIsActive] =  useState(false);
		const [hasError,setHasError] =  useState(false);
		const [shouldRender,setShouldRender] =  useState(false);
		```
		Avoid :x:

		```
		const [active,setActive] =  useState(false);
		const [error,setError] =  useState(false);
		const [render,setRender] =  useState(false);
		```
		b.	Event
		Use **handle** as a prefix for event handler functions. For example, handleClick, handleInputChange

		Correct used :white_check_mark:
		```
		const handleButtonClick = useCallback(()=>{
			setIsActive(!isActive);
		},[isActive]);
		```
		Avoid :x:
		```
		const buttonClick = useCallback(()=>{
			setIsActive(!isActive);
		},[isActive]);
		```
7. Constants
	
	Use **uppercase letters with underscores** to 	represent constants in JavaScript.
	For example: API_URL, MAX_RESULTS.

	Correct used :white_check_mark:
	```
	const API_URL_PREFIX = 'rpc/ppf/budget';
	const DEFAULT_TAKE = 10;
	```
	Avoid :x:
	```
	const api_url_prefix = 'rpc/ppf/budget';
	const default_Take = 10;
	```
8.	Utility functions

	use **camelCase** for utility functions or helper functions and also for event functions


	Correct used :white_check_mark:

	```
	const handleButtonClick = useCallback(()=>{
		setIsActive(!isActive);
	},[isActive]);

	const formatDate = (date: Dayjs) => {
		return dayjs(date).format(STANDARD_DATE_FORMAT_INVERSE);
	}
	```
	Avoid :x:
	```
	const HandleButtonClick = useCallback(()=>{
		setIsActive(!isActive);
	},[isActive]);

	const FormatDate = (date: Dayjs) => {
		return dayjs(date).format(STANDARD_DATE_FORMAT_INVERSE);
	}
	```
9.  Avoid Any Type
	Avoid using the `any` type as much as possible. Instead, provide explicit types or use union types to handle cases where the type can be more than one possibility.
	Correct used :white_check_mark:

	```
	const handleData = (data: AppUser[]) =>{
		... handle data type AppUser
	}
	```
	Avoid :x:
	```
	const handleData = (data: any[]) =>{
		... handle data type any
	}
	```
10. Avoid Unnecessary Type Assertions

	Avoid using type assertions (`as`) unless absolutely necessary. Instead, leverage TypeScript's type inference capabilities and provide explicit types to ensure type safety.

	Correct used :white_check_mark:

	```const result: number = calculateValue(); ```

	Avoid :x:

	`const result: number = calculateValue() as number;`

11. Optimization Techniques

	To optimize ReactJS applications, consider the following techniques:

	-   Use the  `React.memo`  Higher Order Component (HOC) to memoize functional components and prevent unnecessary re-renders.
	-   Utilize the  `useCallback`  hook to memoize event handlers and prevent unnecessary re-creation of functions.
	-   Use the  `useMemo`  hook to memoize expensive computations and avoid redundant calculations.
	```
	const MyComponent: React.FC<Props> = React.memo(({ propA, propB }) => {
		// Component implementation
	});
	```
12. Immutability

	Follow the principle of immutability when updating state or props. Avoid directly mutating objects or arrays, as it can lead to unexpected behavior. Instead, create new copies of objects or arrays using immutable techniques like spread operators or immutable libraries.

	Correct used :white_check_mark:
	```
	const updateItem = (index: number, newItem: Item) => {
		const updatedItems = [...items];
		updatedItems[index] = newItem;
		setItems(updatedItems);
	};
	```
	Avoid :x:
	```
	const updateItem = (index: number, newItem: Item) => {
		items[index] = newItem;
		setItems(items);
	};
	```