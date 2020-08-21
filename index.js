const clientId='8e633e7bfde044ca81985a481d3e3c5e';
const clientSecret='90e5016008974820be46604fddc9bb89';
var token;
window.onload=async ()=>{
    token=await getToken();
  }







const getToken=async ()=>{
  const result=await fetch("https://accounts.spotify.com/api/token",{
    method:'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization':'Basic '+btoa(clientId+":"+clientSecret)
    },
    body: 'grant_type=client_credentials'
  })
  const data=await result.json();
  return data.access_token;
}

var artist1;
var artist2;

const getInput=async()=>{

  const artistOne=await fetch(`https://api.spotify.com/v1/search?q=${input1.value}&type=artist`,{
    method:'GET',
    headers:{
      'Authorization':'Bearer '+token
    }
  })
  const resultTwo=await fetch(`https://api.spotify.com/v1/search?q=${input2.value}&type=artist`,{
    method:'GET',
    headers:{
      'Authorization':'Bearer '+token
    }
  })
  const dataOne=await artistOne.json();
  const dataTwo=await resultTwo.json();
  artist1=dataOne.artists.items[0].id;
  artist2=dataTwo.artists.items[0].id;

  findRelations();
}

const relativeArtistsList=async (id)=>{

  const result=await fetch("https://api.spotify.com/v1/artists/"+id+"/related-artists",{
    method:'GET',
    headers:{
      'Authorization':'Bearer '+token
    }
  })
  console.log(id)
  const data=await result.json();
  return data.artists;
}

const artistDetailArtists=async(id)=>{

  const result=await fetch("https://api.spotify.com/v1/artists/"+id,{
    method:'GET',
    headers:{
      'Authorization':'Bearer '+token
    }
  })

  const data=await result.json();
  return data.name;

}

class Node{
  constructor(data){
      this.data=data;
      this.parent=null;
      this.children=[];
  }
}

class Tree{
  constructor(data){
      var node=new Node(data);
      this.root=node;
  }
}

class Queue{
  constructor(){
    this.arr=[]
  }
  enqueue(data){
    this.arr.push(data);
  }
  dequeue(){
    return this.arr.shift();
  }
}

const input1=document.getElementById("inp1")
const input2=document.getElementById("inp2")


const findRelations=async()=>{
  const tree=new Tree(artist1)
  var artists;
  var queue=new Queue();

  queue.enqueue(tree.root);
  var temp=queue.dequeue();

  while(temp.data!==artist2){
    artists=await relativeArtistsList(temp.data);  
    var parent=temp;
    var child;

    for (var i = 0; i < artists.length; i++) {
      child = new Node(artists[i].id);
      parent.children.push(child);
      child.parent = parent;
      queue.enqueue(child);
    }
    temp=queue.dequeue();
  }
  var artist=[];
  var i=0;
  while(temp.parent!==null){
    artist.push(await artistDetailArtists(temp.parent.data))
    const d=document.createElement('div');
    document.getElementById('container').appendChild(d);
    d.className="element";
 
    if(artist[i].toLowerCase()===input1.value.toLowerCase()){
      d.innertext="";
    }
    else{
        
            d.innerText=artist;
        
    }
    temp=temp.parent;
    i++;
  }

  if(i==1){
    const d=document.createElement('div');
    document.getElementById('container').appendChild(d);
    d.className="element";
    d.innerText="Directly Related";
  }
}

