import Modal from 'react-modal';
import { Treebeard, decorators } from 'react-treebeard';


const modalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',  // This will darken the background
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '60%', // This will make the modal narrower
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
        color: '#333', // Adjust the color to match the Treebeard component
    },
};

const treebeardStyles = {
    tree: {
        base: {
            listStyle: 'none',
            backgroundColor: '#fff', // change the background color to white
            margin: 0,
            padding: 0,
            color: '#333', // Dark grey color for the text
            fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
            fontSize: '14px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: '#f5f5f5' // Slightly lighter than the background color
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#333', // Dark grey color for the arrow
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#333' // Dark grey color for the text
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px #333', // Dark grey color for the connector
                    borderBottom: 'solid 2px #333', // Dark grey color for the connector
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
};

decorators.Header = ({ style, node }) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = { marginRight: '5px' };
  
    return (
      <div style={style.base}>
        <div style={style.title}>
          <i className={iconClass} style={iconStyle} />
          {node.name}
          {node.text && <div dangerouslySetInnerHTML={{ __html: node.text }} />}
        </div>
      </div>
    );
  };

const StoryModal = ({selectedStory, comments, cursor, modalIsOpen, closeModal, setCursor }) => 
    <Modal appElement={document.getElementById('root')} isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles} contentLabel="Story Details">
        <button onClick={closeModal}>Close</button>
        {selectedStory && (
            <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
                <h2>{selectedStory.title}</h2>
                <p>By: {selectedStory.by}</p>
                <p>Score: {selectedStory.score}</p>
                <p>Number of Comments: {selectedStory.descendants}</p>
                <Treebeard
                    data={comments}
                    decorators={decorators}
                    style={treebeardStyles}
                    onToggle={(node, toggled) => {
                        if (cursor) {
                            cursor.active = false;
                        }
        
                        node.active = true;
        
                        if (node.children) {
                            node.toggled = toggled;
                        }
        
                        setCursor(node);
                    }}
                />
            </div>
        )}
    </Modal>;

export default StoryModal;