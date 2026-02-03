export default function UserCard({user}){

    const profileeditor=()=>{
        console.log("This is profile editor nutton and it is clicked");
    }
    return(
        <div className="w-[280px] bg-white shadow border border-slate-200 p-5 rounded-[5px]">
            <div className="flex flex-col items-center text-center">
                <img
                 src="https://i.pinimg.com/736x/60/ce/0c/60ce0c9a3615b165aa5f656625dee9af.jpg"
                 alt="profile" 
                 className="w-40 h-40 rounded-full object-center"
                 />
                 <h2 className="mt-4 font-semibold text-lg">
                    Pravesh Lama
                 </h2>
                 <p className=" text-sm text-grey-500">
                    lamatmzpravesh@gmail.com
                 </p>
                 <button
                 onClick={profileeditor}
                 className="mt-4 w-50 bg-green-100 text-green-700 py-2 rounded-xl font-medium"
                 >
                    Edit Profile
                 </button>
            </div>
        </div>
    )
}