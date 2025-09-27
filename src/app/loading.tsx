const Spinner = () => (
    <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
);

export default function Loading() {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Spinner />
        </div>
    );
}