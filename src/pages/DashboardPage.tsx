// DashboardPage.tsx Placeholder
import MainLayout from '../components/Layout/MainLayout';
import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto py-12">
                <div className="flex justify-between items-center mb-12">
                     <h1 className="text-5xl font-black uppercase">My CVs</h1>
                     <Link to="/create" className="brutal-btn flex items-center gap-2">
                        <Plus size={20} strokeWidth={3} /> New CV
                     </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Empty State */}
                    <div className="col-span-full border-3 border-black border-dashed p-12 flex flex-col items-center justify-center bg-gray-50">
                        <FileText size={48} className="text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold uppercase mb-2">No CVs yet</h2>
                        <p className="font-mono mb-6 text-gray-500">You haven't created any masterpiece yet.</p>
                        <Link to="/create" className="brutal-btn-lime">
                            Create First CV
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
