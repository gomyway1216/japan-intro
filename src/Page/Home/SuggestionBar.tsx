import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DEFAULT_OPTIONS = [
  { id: 0, title: 'All', url: '/' },
  { id: 1, title: 'Anime', url: '/anime' },
  { id: 2, title: 'Food', url: '/food' },
  { id: 3, title: 'Transportation', url: '/transportation' },
  { id: 4, title: 'Culture', url: '/culture' },
  { id: 5, title: 'Traveling', url: '/traveling' },
  { id: 6, title: 'Song', url: '/song' },
  { id: 7, title: 'Celebrity', url: '/celebrity' },
  { id: 8, title: 'Personal', url: '/personal' },
  { id: 9, title: 'Other', url: '/other' }
];

export default function SuggestionBar({ activeTab, setActiveTab }:
  { activeTab: string | undefined, setActiveTab: (tab: string) => void }) {
  // console.log('activeTab', activeTab);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);

  useEffect(() => {

  }, [activeTab]);

  return (
    <div
      className="hide_scroll"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "30px",
        borderBottom: "solid 1px rgba(242, 242, 242, 1)",
        gap: "28px",
        width: "90%",
        marginRight: "auto",
        marginBottom: "12px",
        overflowX: "auto",
        marginTop: "12px",
      }}
    >
      <>
        {options.map((option) => {
          return (
            <Link
              to={`${option.url}`}
              onClick={() => setActiveTab(option.title.toLowerCase())}
              style={{
                textDecoration: "none",
                color: activeTab === option.title ? "black" : "gray",
                fontSize: "14px",
                fontFamily: "Questrial",
                whiteSpace: "nowrap",
                borderBottom:
                  activeTab === option.title.toLowerCase() ? "2px solid black" : "none",
                height: activeTab === option.title.toLowerCase() ? "94%" : "98%",
                zIndex: "99",
                padding: "0 2px",
              }}
              key={option.id}
            >
              {option.title}
            </Link>
          );
        })}
      </>
    </div>
  );
}
