export default function DocumentLoading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4" />
                <p className="text-gray-500">Loading document...</p>
            </div>
        </div>
    );
}