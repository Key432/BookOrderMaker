import Orderer from './Orderer';
import Orders from './Orders';

function App() {
  return (
    <div className="flex h-screen w-full justify-center text-center print:h-auto print:p-0">
      <div className="w-3/4 font-serif print:w-full print:p-2">
        <h1 className="pb-4 pt-4 text-[32px] print:pb-2 print:pt-0 print:text-2xl">
          書籍注文票
        </h1>
        <Orderer className="mb-4 ml-12 mr-12 text-left print:mb-2 print:ml-0 print:mr-0" />
        <Orders className="pl-12 pr-12 print:pl-0 print:pr-0" />
      </div>
    </div>
  );
}

export default App;
